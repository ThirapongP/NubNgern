'use strict';

require('dotenv').config();

const path=require('path');
const express=require('express');
const cors=require('cors');
const helmet=require('helmet');
const morgan=require('morgan');
const multer=require('multer');
const Joi=require('joi');
const ExcelJS=require('exceljs');
const cron=require('node-cron');
const {createClient}=require('@supabase/supabase-js');

const app=express();

const PORT=process.env.PORT||4000;
const SUPABASE_URL=process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY=process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY=
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const SUPABASE_BUCKET=
  process.env.SUPABASE_BUCKET||'transaction-images';

if(!SUPABASE_URL||!SUPABASE_ANON_KEY||!SUPABASE_SERVICE_ROLE_KEY){

  console.error(
    '[FATAL] SUPABASE_URL, SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY missing'
  );

  process.exit(1);
}

const supabase=createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth:{
      persistSession:false
    }
  }
);


const frontendPath=
  path.resolve(__dirname,'../../frontend');


/* ================= MIDDLEWARE ================= */

app.use(
  helmet({
    crossOriginOpenerPolicy:false,
    contentSecurityPolicy:{
      directives:{
        defaultSrc:["'self'"],
        scriptSrc:[
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'https://cdn.tailwindcss.com',
          'https://cdn.jsdelivr.net'
        ],
        styleSrc:[
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
          'https://cdn.jsdelivr.net'
        ],
        fontSrc:["'self'",'data:','https://fonts.gstatic.com'],
        connectSrc:["'self'",'https://*.supabase.co','wss://*.supabase.co'],
        imgSrc:["'self'",'data:','blob:','https://*.supabase.co'],
        objectSrc:["'none'"],
        frameAncestors:["'self'"],
        upgradeInsecureRequests:null
      }
    }
  })
);

app.use(
  cors({
    origin:process.env.CORS_ORIGIN
      ?process.env.CORS_ORIGIN.split(',').map(origin=>origin.trim())
      :true,
    credentials:true
  })
);

app.use(morgan('dev'));

app.use(
  express.json({
    limit:'2mb'
  })
);

app.use(
  express.urlencoded({
    extended:true
  })
);


/* ================= FRONTEND ================= */

app.get('/config.js',(_,res)=>{
  res.set('Cache-Control','no-store');
  res.type('application/javascript');
  res.send(`window.__APP_CONFIG__ = ${JSON.stringify({
    supabaseUrl: SUPABASE_URL,
    supabaseAnonKey: SUPABASE_ANON_KEY
  })};`);
});

app.use(
  express.static(frontendPath)
);


/* ================= AUTH ================= */

async function requireAuth(req,res,next){

  try{

    const header=
      req.headers.authorization||'';

    if(!header.startsWith('Bearer ')){

      return res.status(401).json({
        error:'Unauthorized',
        message:'Missing Bearer token'
      });
    }

    const token=
      header.slice(7).trim();

    const {
      data,
      error
    }=
      await supabase.auth.getUser(token);

    if(error||!data?.user){

      return res.status(401).json({
        error:'Unauthorized',
        message:'Invalid or expired token'
      });
    }

    req.user=data.user;

    next();

  }catch(err){

    next(err);

  }
}


/* ================= VALIDATION ================= */

const uuid=
  Joi.string().guid({
    version:['uuidv4']
  });


function validate(schema,source='body'){

  return(req,res,next)=>{

    const {
      error,
      value
    }=
      schema.validate(
        req[source],
        {
          abortEarly:true,
          stripUnknown:true,
          convert:true
        }
      );

    if(error){

      return res.status(400).json({
        error:'ValidationError',
        message:error.details[0].message,
        field:error.details[0].path.join('.')
      });

    }

    req[source]=value;

    next();
  };
}


const transactionSchema=
  Joi.object({

    type:Joi.string()
      .valid('income','expense')
      .required(),

    category:Joi.string()
      .trim()
      .max(50)
      .required(),

    amount:Joi.number()
      .positive()
      .max(100000000)
      .precision(2)
      .required(),

    payment_method:Joi.string()
      .valid('cash','bank','credit')
      .required(),

    is_subscription:Joi.boolean()
      .default(false),

    note:Joi.string()
      .trim()
      .max(500)
      .allow('',null)
      .default(''),

    occurred_at:Joi.date()
      .iso()
      .max('now')
      .required()

  });


const subscriptionSchema=
  Joi.object({

    type:Joi.string()
      .valid('income','expense')
      .required(),

    category:Joi.string()
      .trim()
      .max(50)
      .required(),

    amount:Joi.number()
      .positive()
      .max(100000000)
      .precision(2)
      .required(),

    payment_method:Joi.string()
      .valid('cash','bank','credit')
      .required(),

    note:Joi.string()
      .trim()
      .max(500)
      .allow('',null)
      .default(''),

    frequency:Joi.string()
      .valid(
        'daily',
        'weekly',
        'monthly',
        'yearly'
      )
      .required(),

    next_run_at:Joi.date()
      .iso()
      .required()

  });


const listSchema=
  Joi.object({

    range:Joi.string()
      .valid('weekly','monthly','all')
      .default('monthly'),

    type:Joi.string()
      .valid('income','expense','all')
      .default('all')

  });


/* ================= HELPERS ================= */

function dateRange(range){

  const now=new Date();

  if(range==='weekly'){

    const start=new Date(now);

    const day=start.getDay();

    const diff=day===0?-6:1-day;

    start.setDate(
      start.getDate()+diff
    );

    start.setHours(0,0,0,0);

    return start.toISOString();
  }

  if(range==='monthly'){

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString();

  }

  return null;
}


function nextRun(date,frequency){

  const d=new Date(date);

  if(frequency==='daily'){
    d.setDate(d.getDate()+1);
  }

  if(frequency==='weekly'){
    d.setDate(d.getDate()+7);
  }

  if(frequency==='monthly'){
    d.setMonth(d.getMonth()+1);
  }

  if(frequency==='yearly'){
    d.setFullYear(d.getFullYear()+1);
  }

  return d.toISOString();
}


/* ================= HEALTH ================= */

app.get(
  '/health',
  (req,res)=>{
    res.json({
      ok:true,
      service:'NubNgern',
      port:PORT,
      time:new Date().toISOString()
    });
  }
);


/* ================= TRANSACTIONS ================= */

app.get(
  '/api/transactions',
  requireAuth,
  validate(listSchema,'query'),
  async(req,res,next)=>{

    try{

      const {
        range,
        type
      }=req.query;

      let query=
        supabase
          .from('transactions')
          .select('*')
          .eq('user_id',req.user.id)
          .order(
            'occurred_at',
            {
              ascending:false
            }
          )
          .order(
            'created_at',
            {
              ascending:false
            }
          );

      const since=dateRange(range);

      if(since){
        query=query.gte(
          'occurred_at',
          since
        );
      }

      if(type!=='all'){
        query=query.eq(
          'type',
          type
        );
      }

      const {
        data,
        error
      }=await query;

      if(error) throw error;

      res.json(data||[]);

    }catch(err){

      next(err);

    }
  }
);


app.post(
  '/api/transactions',
  requireAuth,
  validate(transactionSchema),
  async(req,res,next)=>{

    try{

      const payload={
        ...req.body,
        user_id:req.user.id
      };

      const {
        data,
        error
      }=
        await supabase
          .from('transactions')
          .insert(payload)
          .select('*')
          .single();

      if(error) throw error;

      res.status(201).json(data);

    }catch(err){

      next(err);

    }
  }
);


app.delete(
  '/api/transactions/:id',
  requireAuth,
  validate(
    Joi.object({
      id:uuid.required()
    }),
    'params'
  ),
  async(req,res,next)=>{

    try{

      const {
        data,
        error
      }=
        await supabase
          .from('transactions')
          .delete()
          .eq('id',req.params.id)
          .eq('user_id',req.user.id)
          .select('id');

      if(error) throw error;

      if(!data?.length){

        return res.status(404).json({
          error:'NotFound',
          message:'Transaction not found'
        });

      }

      res.status(204).send();

    }catch(err){

      next(err);

    }
  }
);


/* ================= DASHBOARD ================= */

app.get(
  '/api/dashboard/summary',
  requireAuth,
  validate(listSchema,'query'),
  async(req,res,next)=>{

    try{

      const since=
        dateRange(req.query.range);

      let query=
        supabase
          .from('transactions')
          .select(
            'type,amount,category'
          )
          .eq(
            'user_id',
            req.user.id
          );

      if(since){

        query=query.gte(
          'occurred_at',
          since
        );

      }

      const {
        data,
        error
      }=await query;

      if(error) throw error;

      let income=0;
      let expense=0;

      const categoryBreakdown={};

      for(const tx of data||[]){

        const amount=
          Number(tx.amount);

        if(tx.type==='income'){

          income+=amount;

        }else{

          expense+=amount;

          const key=
            tx.category||'other';

          if(!categoryBreakdown[key]){

            categoryBreakdown[key]={
              name:key,
              color:'#94a3b8',
              total:0
            };

          }

          categoryBreakdown[key].total+=
            amount;
        }
      }

      const net=income-expense;

      res.json({
        income,
        expense,
        net,
        isNegative:net<=0,
        categoryBreakdown:
          Object.values(
            categoryBreakdown
          ).sort(
            (a,b)=>b.total-a.total
          )
      });

    }catch(err){

      next(err);

    }
  }
);


/* ================= SUBSCRIPTIONS ================= */

app.get(
  '/api/subscriptions',
  requireAuth,
  async(req,res,next)=>{

    try{

      const {
        data,
        error
      }=
        await supabase
          .from('subscriptions')
          .select('*')
          .eq(
            'user_id',
            req.user.id
          )
          .order(
            'next_run_at',
            {
              ascending:true
            }
          );

      if(error) throw error;

      res.json(data||[]);

    }catch(err){

      next(err);

    }
  }
);


app.post(
  '/api/subscriptions',
  requireAuth,
  validate(subscriptionSchema),
  async(req,res,next)=>{

    try{

      const {
        data,
        error
      }=
        await supabase
          .from('subscriptions')
          .insert({
            ...req.body,
            user_id:req.user.id,
            is_active:true
          })
          .select('*')
          .single();

      if(error) throw error;

      res.status(201).json(data);

    }catch(err){

      next(err);

    }
  }
);


app.patch(
  '/api/subscriptions/:id/toggle',
  requireAuth,
  validate(
    Joi.object({
      id:uuid.required()
    }),
    'params'
  ),
  async(req,res,next)=>{

    try{

      const {
        data:sub,
        error
      }=
        await supabase
          .from('subscriptions')
          .select(
            'id,is_active'
          )
          .eq(
            'id',
            req.params.id
          )
          .eq(
            'user_id',
            req.user.id
          )
          .maybeSingle();

      if(error) throw error;

      if(!sub){

        return res.status(404).json({
          error:'NotFound',
          message:'Subscription not found'
        });

      }

      const {
        data,
        error:updateError
      }=
        await supabase
          .from('subscriptions')
          .update({
            is_active:!sub.is_active
          })
          .eq(
            'id',
            sub.id
          )
          .eq(
            'user_id',
            req.user.id
          )
          .select('*')
          .single();

      if(updateError) throw updateError;

      res.json(data);

    }catch(err){

      next(err);

    }
  }
);


app.delete(
  '/api/subscriptions/:id',
  requireAuth,
  validate(
    Joi.object({
      id:uuid.required()
    }),
    'params'
  ),
  async(req,res,next)=>{

    try{

      const {
        data,
        error
      }=
        await supabase
          .from('subscriptions')
          .delete()
          .eq(
            'id',
            req.params.id
          )
          .eq(
            'user_id',
            req.user.id
          )
          .select('id');

      if(error) throw error;

      if(!data?.length){

        return res.status(404).json({
          error:'NotFound',
          message:'Subscription not found'
        });

      }

      res.status(204).send();

    }catch(err){

      next(err);

    }
  }
);


/* ================= UPLOAD ================= */

const upload=
  multer({
    storage:multer.memoryStorage(),

    limits:{
      fileSize:3*1024*1024,
      files:1
    },

    fileFilter:(req,file,cb)=>{

      const allowed=[
        'image/jpeg',
        'image/png',
        'image/webp'
      ];

      if(!allowed.includes(file.mimetype)){

        return cb(
          new Error(
            'Only JPEG, PNG and WEBP are allowed'
          )
        );

      }

      cb(null,true);
    }
  });


app.post(
  '/api/upload',
  requireAuth,
  upload.single('image'),
  async(req,res,next)=>{

    try{

      if(!req.file){

        return res.status(400).json({
          error:'NoFile',
          message:'No image provided'
        });

      }

      const ext=
        req.file.mimetype==='image/webp'
        ?'webp'
        :req.file.mimetype==='image/png'
        ?'png'
        :'jpg';

      const storagePath=
        `${req.user.id}/${Date.now()}.${ext}`;

      const {
        error
      }=
        await supabase.storage
          .from(SUPABASE_BUCKET)
          .upload(
            storagePath,
            req.file.buffer,
            {
              contentType:req.file.mimetype,
              upsert:false
            }
          );

      if(error) throw error;

      const {
        data
      }=
        supabase.storage
          .from(SUPABASE_BUCKET)
          .getPublicUrl(storagePath);

      res.status(201).json({
        url:data.publicUrl,
        path:storagePath
      });

    }catch(err){

      next(err);

    }
  }
);


/* ================= EXCEL ================= */

app.get(
  '/api/export/xlsx',
  requireAuth,
  validate(listSchema,'query'),
  async(req,res,next)=>{

    try{

      const since=
        dateRange(req.query.range);

      let query=
        supabase
          .from('transactions')
          .select(
            'occurred_at,type,category,amount,payment_method,is_subscription,note'
          )
          .eq(
            'user_id',
            req.user.id
          )
          .order(
            'occurred_at',
            {
              ascending:false
            }
          );

      if(since){

        query=query.gte(
          'occurred_at',
          since
        );

      }

      if(req.query.type!=='all'){

        query=query.eq(
          'type',
          req.query.type
        );

      }

      const {
        data,
        error
      }=await query;

      if(error) throw error;

      const workbook=
        new ExcelJS.Workbook();

      const sheet=
        workbook.addWorksheet(
          'Transactions'
        );

      sheet.columns=[
        {
          header:'Date',
          key:'date',
          width:22
        },
        {
          header:'Type',
          key:'type',
          width:12
        },
        {
          header:'Category',
          key:'category',
          width:20
        },
        {
          header:'Amount',
          key:'amount',
          width:15
        },
        {
          header:'Payment',
          key:'payment_method',
          width:18
        },
        {
          header:'Subscription',
          key:'is_subscription',
          width:15
        },
        {
          header:'Note',
          key:'note',
          width:40
        }
      ];

      sheet.getRow(1).font={
        bold:true
      };

      let income=0;
      let expense=0;

      for(const tx of data||[]){

        const amount=
          Number(tx.amount);

        sheet.addRow({
          date:new Date(
            tx.occurred_at
          ).toLocaleString(),

          type:tx.type,

          category:tx.category,

          amount,

          payment_method:
            tx.payment_method,

          is_subscription:
            tx.is_subscription?'Yes':'No',

          note:tx.note||''
        });

        if(tx.type==='income'){
          income+=amount;
        }else{
          expense+=amount;
        }
      }

      sheet.addRow({});

      sheet.addRow({
        category:'Total Income',
        amount:income
      }).font={bold:true};

      sheet.addRow({
        category:'Total Expense',
        amount:expense
      }).font={bold:true};

      sheet.addRow({
        category:'Net Balance',
        amount:income-expense
      }).font={bold:true};

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="nubngern_${Date.now()}.xlsx"`
      );

      await workbook.xlsx.write(res);

      res.end();

    }catch(err){

      next(err);

    }
  }
);


/* ================= CRON ================= */

async function processSubscriptions(){

  const now=new Date();

  const {
    data,
    error
  }=
    await supabase
      .from('subscriptions')
      .select('*')
      .eq(
        'is_active',
        true
      )
      .lte(
        'next_run_at',
        now.toISOString()
      );

  if(error){

    console.error(
      '[cron]',
      error.message
    );

    return;
  }

  for(const sub of data||[]){

    try{

      await supabase
        .from('transactions')
        .insert({
          user_id:sub.user_id,
          type:sub.type,
          category:sub.category,
          amount:sub.amount,
          payment_method:sub.payment_method,
          is_subscription:true,
          note:
            sub.note||
            'Auto-generated recurring transaction',
          occurred_at:
            now.toISOString()
        });

      await supabase
        .from('subscriptions')
        .update({
          last_run_at:
            now.toISOString(),

          next_run_at:
            nextRun(
              sub.next_run_at,
              sub.frequency
            )
        })
        .eq(
          'id',
          sub.id
        );

    }catch(err){

      console.error(
        '[cron] Subscription failed:',
        sub.id,
        err.message
      );

    }
  }
}

cron.schedule(
  '0 * * * *',
  processSubscriptions
);


/* ================= API 404 ================= */

app.use(
  '/api',
  (req,res)=>{
    res.status(404).json({
      error:'NotFound',
      message:'API route not found'
    });
  }
);


/* ================= FRONTEND FALLBACK ================= */

app.use(
  (req,res,next)=>{

    if(req.method!=='GET'){
      return next();
    }

    if(req.path.startsWith('/api')){
      return next();
    }

    res.sendFile(
      path.join(
        frontendPath,
        'index.html'
      ),
      err=>{
        if(err) next(err);
      }
    );
  }
);


/* ================= ERROR ================= */

app.use(
  (err,req,res,next)=>{

    console.error(
      '[ERROR]',
      err
    );

    res.status(
      err.status||500
    ).json({
      error:'InternalServerError',
      message:
        err.message||
        'Unexpected server error'
    });

  }
);


/* ================= START ================= */

app.listen(
  PORT,
  ()=>{
    console.log('');
    console.log('==============================');
    console.log(' NubNgern Backend');
    console.log(
      ` http://localhost:${PORT}`
    );
    console.log('==============================');
    console.log('');
  }
);