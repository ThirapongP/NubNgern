'use strict';

const path=require('node:path');
require('dotenv').config({path:path.resolve(__dirname,'../../.env')});

const http=require('node:http');
const fs=require('node:fs');

const frontendRoot=path.resolve(__dirname,'../../../frontend');
const SUPABASE_URL=process.env.SUPABASE_URL||'https://example.supabase.co';
const SUPABASE_ANON_KEY=process.env.SUPABASE_ANON_KEY||'public-demo-key';
const contentTypes={
  '.css':'text/css; charset=utf-8',
  '.html':'text/html; charset=utf-8',
  '.js':'text/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.webmanifest':'application/manifest+json; charset=utf-8',
  '.svg':'image/svg+xml',
  '.png':'image/png'
};

http.createServer((req,res)=>{
  if(req.method!=='GET'){
    res.writeHead(405);
    return res.end('Method not allowed');
  }

  let pathname;
  try{
    pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  }catch{
    res.writeHead(400);
    return res.end('Invalid URL');
  }

  if(pathname==='/config.js'){
    res.writeHead(200,{
      'Content-Type':'application/javascript; charset=utf-8',
      'Cache-Control':'no-store',
      'X-Content-Type-Options':'nosniff'
    });
    return res.end(`window.__APP_CONFIG__ = ${JSON.stringify({
      supabaseUrl: SUPABASE_URL,
      supabaseAnonKey: SUPABASE_ANON_KEY
    })};`);
  }

  const requestedPath=path.resolve(frontendRoot,`.${pathname==='/'?'/index.html':pathname}`);
  if(!requestedPath.startsWith(frontendRoot+path.sep)){
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(requestedPath,(error,content)=>{
    if(error){
      res.writeHead(404);
      return res.end('Not found');
    }

    res.writeHead(200,{
      'Content-Type':contentTypes[path.extname(requestedPath)]||'application/octet-stream',
      'X-Content-Type-Options':'nosniff'
    });
    res.end(content);
  });
}).listen(4173,'127.0.0.1');