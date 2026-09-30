'use strict';

const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');

const mockSupabase=`
(()=>{
  const today=new Date().toISOString();
  const user={id:'test-user',email:'demo@nubngern.local',user_metadata:{full_name:'Demo User'}};
  const state={
    transactions:[{id:'trx-seed',user_id:user.id,type:'expense',category:'food',amount:25,payment_method:'cash',is_subscription:false,note:'Lunch',occurred_at:today,created_at:today}],
    subscriptions:[{id:'sub-seed',user_id:user.id,type:'expense',category:'bills',amount:499,payment_method:'bank',note:'Internet',frequency:'monthly',next_run_at:today,last_run_at:null,is_active:true}],
    profiles:[{id:user.id,display_name:'Demo User',lang:'en',theme:'light',monthly_expense_budget:3000}]
  };
  let nextId=0;
  class Query{
    constructor(table){this.table=table;this.operation='select';this.payload=null;this.filters=[];this.one=false;this.zeroOrOne=false;}
    select(){return this;}
    order(){return this;}
    eq(field,value){this.filters.push([field,value]);return this;}
    insert(payload){this.operation='insert';this.payload=payload;return this;}
    update(payload){this.operation='update';this.payload=payload;return this;}
    upsert(payload){this.operation='upsert';this.payload=payload;return this;}
    delete(){this.operation='delete';return this;}
    single(){this.one=true;return this.execute();}
    maybeSingle(){this.zeroOrOne=true;return this.execute();}
    then(resolve,reject){return this.execute().then(resolve,reject);}
    async execute(){
      const rows=state[this.table];
      const matches=()=>rows.filter(row=>this.filters.every(([key,value])=>row[key]===value));
      const clone=value=>JSON.parse(JSON.stringify(value));
      let result;
      if(this.operation==='insert'){
        const created=(Array.isArray(this.payload)?this.payload:[this.payload]).map(value=>({id:'mock-'+(++nextId),created_at:new Date().toISOString(),...value}));
        rows.push(...created);
        result=created;
      }else if(this.operation==='upsert'){
        const value=this.payload;
        const existing=rows.find(row=>row.id===value.id);
        if(existing) Object.assign(existing,value);
        else rows.push(value);
        result=[existing||value];
      }else if(this.operation==='update'){
        result=matches();
        result.forEach(row=>Object.assign(row,this.payload));
      }else if(this.operation==='delete'){
        result=matches();
        result.forEach(row=>rows.splice(rows.indexOf(row),1));
      }else{
        result=matches();
      }
      if(this.one) return {data:result.length?clone(result[0]):null,error:result.length?null:{message:'Row not found'}};
      if(this.zeroOrOne) return {data:result.length?clone(result[0]):null,error:null};
      return {data:clone(result),error:null};
    }
  }
  window.__mockDatabase=state;
  window.supabase={createClient:()=>({
    auth:{
      getSession:async()=>({data:{session:{access_token:'mock-token',user}}}),
      getUser:async()=>({data:{user}}),
      onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),
      signInWithPassword:async()=>({error:null}),
      signUp:async()=>({error:null}),
      signInWithOAuth:async()=>({error:null}),
      signOut:async()=>({error:null})
    },
    from:table=>new Query(table)
  })};
})();
`;

test.beforeEach(async({page})=>{
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.fulfill({
    status:200,
    contentType:'application/javascript',
    body:mockSupabase
  }));
  await page.route('https://cdn.jsdelivr.net/npm/chart.js',route=>route.fulfill({
    status:200,
    contentType:'application/javascript',
    body:'window.Chart=class {constructor(){} destroy(){}};'
  }));
  await page.route('https://unpkg.com/lucide@0.468.0',route=>route.fulfill({
    status:200,
    contentType:'application/javascript',
    body:"window.lucide={createIcons(){document.querySelectorAll('[data-lucide]').forEach(icon=>icon.innerHTML='<svg width=\\\"24\\\" height=\\\"24\\\" aria-hidden=\\\"true\\\"></svg>')}};"
  }));
  await page.goto('/');
  await expect(page.locator('[data-testid="transaction-row"]')).toHaveCount(1);
});

test('creates, edits, and deletes a transaction',async({page})=>{
  const editButton=page.getByTestId('edit-transaction');
  const deleteButton=page.getByTestId('delete-transaction');
  const editBox=await editButton.boundingBox();
  const deleteBox=await deleteButton.boundingBox();
  expect(deleteBox.x-editBox.x-editBox.width).toBeLessThanOrEqual(6);
  expect(await page.locator('[data-testid="transaction-row"] svg.app-icon path').count()).toBeGreaterThan(1);

  await page.getByTestId('edit-transaction').click();
  await page.getByTestId('transaction-amount').fill('40.50');
  await page.getByTestId('transaction-note').fill('Updated lunch');
  await page.getByRole('button',{name:'Save changes'}).click();
  await expect(page.getByTestId('transaction-row')).toContainText('40.5');
  await expect(page.getByTestId('transaction-row')).toContainText('Updated lunch');

  await page.getByRole('button',{name:'Add transaction'}).click();
  await page.getByTestId('transaction-amount').fill('12.25');
  await page.getByTestId('transaction-note').fill('Coffee');
  await page.getByRole('button',{name:'Save Transaction'}).click();
  await expect(page.getByTestId('transaction-row')).toHaveCount(2);

  await page.getByTestId('delete-transaction').last().click();
  await page.getByTestId('confirm-delete').click();
  await expect(page.getByTestId('transaction-row')).toHaveCount(1);

  const row=page.getByTestId('transaction-row').first();
  await expect(row.locator('.transition-transform')).toHaveCount(0);
  await expect(row.getByTestId('swipe-delete')).toHaveCount(0);
  const overviewDate=page.locator('section.app-overview input[type="date"]');
  const selectedDate=await overviewDate.inputValue();
  await row.evaluate(element=>{
    const touch=x=>new Touch({identifier:1,target:element,clientX:x,clientY:10});
    element.dispatchEvent(new TouchEvent('touchstart',{bubbles:true,touches:[touch(280)],changedTouches:[touch(280)]}));
    element.dispatchEvent(new TouchEvent('touchend',{bubbles:true,touches:[],changedTouches:[touch(180)]}));
  });
  await expect(overviewDate).toHaveValue(selectedDate);
  await row.getByTestId('delete-transaction').click();
  await page.getByTestId('confirm-delete').click();
  await expect(page.getByTestId('transaction-row')).toHaveCount(0);
});

test('updates the display name in the profile table',async({page})=>{
  await page.getByRole('button',{name:'Settings'}).click();
  await expect(page.getByTestId('profile-form').getByLabel('Email')).toHaveCount(0);
  await page.getByTestId('display-name').fill('NubNgern Member');
  await page.getByTestId('monthly-budget').fill('9000');
  await page.getByRole('button',{name:'Save profile'}).click();
  await expect(page.getByRole('status')).toHaveText('Profile saved');
  await expect.poll(()=>page.evaluate(()=>window.__mockDatabase.profiles[0].display_name)).toBe('NubNgern Member');
  await expect.poll(()=>page.evaluate(()=>window.__mockDatabase.profiles[0].monthly_expense_budget)).toBe(9000);

  await page.getByRole('button',{name:'EN',exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>window.__mockDatabase.profiles[0].lang)).toBe('th');
  await page.getByRole('button',{name:'☀️ Light'}).click();
  await expect.poll(()=>page.evaluate(()=>window.__mockDatabase.profiles[0].theme)).toBe('dark');
});

test('edits an existing recurring subscription',async({page})=>{
  await page.getByRole('button',{name:'Settings'}).click();
  await page.getByTestId('edit-subscription').click();
  await page.getByTestId('transaction-amount').fill('525');
  await page.getByTestId('transaction-note').fill('Updated internet');
  await page.getByRole('button',{name:'Save changes'}).click();
  await expect.poll(()=>page.evaluate(()=>window.__mockDatabase.subscriptions[0].amount)).toBe(525);
  await expect.poll(()=>page.evaluate(()=>window.__mockDatabase.subscriptions[0].note)).toBe('Updated internet');
});

test('renders responsive overview screenshots without horizontal overflow',async({page})=>{
  const screenshots=path.resolve(__dirname,'../../../screenshots');
  fs.mkdirSync(screenshots,{recursive:true});

  for(const viewport of [{width:1440,height:1000,name:'desktop'},{width:390,height:844,name:'mobile'}]){
    await page.setViewportSize({width:viewport.width,height:viewport.height});
    await expect(page.getByRole('heading',{name:"Today's Overview"})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
    await page.screenshot({path:path.join(screenshots,`overview-${viewport.name}.png`),fullPage:true});
  }
});

test('calculates daily expense levels and opens a selected calendar day',async({page})=>{
  const sampleDays=await page.evaluate(()=>{
    const app=document.querySelector('html')._x_dataStack[0];
    app.monthlyExpenseBudget='3000';
    const [year,month]=app.calendarMonth.split('-').map(Number);
    const dayCount=new Date(Date.UTC(year,month,0)).getUTCDate();
    const occupied=new Set(app.transactions.map(item=>app.transactionDate(item)));
    const days=[];
    for(let day=1;day<=dayCount&&days.length<4;day++){
      const date=[year,String(month).padStart(2,'0'),String(day).padStart(2,'0')].join('-');
      if(!occupied.has(date)) days.push(date);
    }
    const ratios=[0.5,0.7,0.99,1];
    const rows=days.map((date,index)=>({
      id:`heat-${index}`,
      user_id:'test-user',
      type:'expense',
      category:'food',
      amount:Number((app.calendarDailyBudget*ratios[index]).toFixed(2)),
      payment_method:'cash',
      is_subscription:false,
      note:'Heatmap test',
      occurred_at:`${date}T12:00:00.000Z`,
      created_at:new Date().toISOString()
    }));
    app.transactions=[...app.transactions,...rows];
    window.__mockDatabase.transactions.push(...structuredClone(rows));
    window.__mockDatabase.profiles[0].monthly_expense_budget=3000;
    return days;
  });

  await page.getByTestId('calendar-nav').click();
  expect(await page.getByTestId('calendar-day').count()).toBeGreaterThan(27);
  await expect(page.locator(`[data-date="${sampleDays[0]}"]`)).toHaveClass(/heatmap-green/);
  await expect(page.locator(`[data-date="${sampleDays[1]}"]`)).toHaveClass(/heatmap-amber/);
  await expect(page.locator(`[data-date="${sampleDays[2]}"]`)).toHaveClass(/heatmap-amber/);
  await expect(page.locator(`[data-date="${sampleDays[3]}"]`)).toHaveClass(/heatmap-red/);
  await page.screenshot({path:path.resolve(__dirname,'../../../screenshots/calendar-heatmap.png'),fullPage:true});

  const currentMonth=await page.getByTestId('calendar-month').innerText();
  await page.getByRole('button',{name:'Previous month'}).click();
  await expect(page.getByTestId('calendar-month')).not.toHaveText(currentMonth);
  await page.getByRole('button',{name:'Next month'}).click();
  await page.locator(`[data-date="${sampleDays[1]}"]`).click();
  await expect(page.getByRole('heading',{name:"Today's Overview"})).toBeVisible();
  await expect(page.locator('.app-overview input[type="date"]')).toHaveValue(sampleDays[1]);
});

test('scopes date swipes, keeps OAuth callbacks safe, and hides unavailable LINE login',async({page})=>{
  const dateInput=page.locator('.app-overview input[type="date"]');
  const before=await dateInput.inputValue();
  const [year,month,day]=before.split('-').map(Number);
  const expected=new Date(Date.UTC(year,month-1,day+1)).toISOString().slice(0,10);
  await page.locator('.app-overview h2').evaluate(element=>{
    const touch=(x)=>new Touch({identifier:1,target:element,clientX:x,clientY:12});
    element.dispatchEvent(new TouchEvent('touchstart',{bubbles:true,touches:[touch(260)]}));
    element.dispatchEvent(new TouchEvent('touchend',{bubbles:true,changedTouches:[touch(180)],touches:[]}));
  });
  await expect(dateInput).toHaveValue(before);
  await dateInput.evaluate(element=>{
    const swipeArea=element.parentElement;
    const touch=(x)=>new Touch({identifier:1,target:swipeArea,clientX:x,clientY:12});
    swipeArea.dispatchEvent(new TouchEvent('touchstart',{bubbles:true,touches:[touch(260)]}));
    swipeArea.dispatchEvent(new TouchEvent('touchend',{bubbles:true,changedTouches:[touch(180)],touches:[]}));
  });
  await expect(dateInput).toHaveValue(expected);

  const redirects=await page.evaluate(()=>{
    const app=document.querySelector('html')._x_dataStack[0];
    const web=app.authRedirectUrl('http://localhost:3000/index.html');
    const file=app.authRedirectUrl('file:///C:/Project/NubNgern/frontend/index.html');
    return {web,file,error:app.errorMessage};
  });
  expect(redirects.web).toBe('http://localhost:3000/');
  expect(redirects.file).toBeNull();
  expect(redirects.error).toContain('web server');

  await page.evaluate(()=>document.querySelector('html')._x_dataStack[0].view='auth');
  await expect(page.getByText('LINE',{exact:true})).toHaveCount(0);
  await expect(page.getByText(/LINE sign-in is unavailable/)).toHaveCount(0);
});

test('serves an installable PWA shell without caching private API data',async({page})=>{
  const manifestResponse=await page.request.get('/manifest.webmanifest');
  expect(manifestResponse.ok()).toBe(true);
  expect(manifestResponse.headers()['content-type']).toContain('application/manifest+json');
  const manifest=await manifestResponse.json();
  expect(manifest.display).toBe('standalone');
  expect(manifest.icons.some(icon=>icon.src==='/icon.svg')).toBe(true);
  expect(manifest.icons.map(icon=>icon.sizes)).toEqual(expect.arrayContaining(['192x192','512x512']));
  for(const size of [192,512]){
    const iconResponse=await page.request.get(`/icon-${size}.png`);
    expect(iconResponse.ok()).toBe(true);
    expect(iconResponse.headers()['content-type']).toContain('image/png');
  }

  const workerResponse=await page.request.get('/service-worker.js');
  expect(workerResponse.ok()).toBe(true);
  expect(await workerResponse.text()).toContain("url.pathname.startsWith('/api/')");
  const activeWorker=await page.evaluate(async()=>{
    const registration=await navigator.serviceWorker.ready;
    return registration.active?.scriptURL;
  });
  expect(activeWorker).toContain('/service-worker.js');
  const cachedUrls=await page.evaluate(async()=>{
    const cache=await caches.open('nubngern-shell-v1');
    return (await cache.keys()).map(request=>new URL(request.url).pathname);
  });
  expect(cachedUrls.every(url=>!url.startsWith('/api/'))).toBe(true);
});

test('keeps install out of Settings and disables pinch zoom in installed mode',async({page})=>{
  await page.addInitScript(()=>{
    const originalMatchMedia=window.matchMedia.bind(window);
    window.matchMedia=query=>query==='(display-mode: standalone)'
      ?{matches:true,media:query,onchange:null,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){},dispatchEvent(){return false;}}
      :originalMatchMedia(query);
    Object.defineProperty(navigator,'standalone',{configurable:true,value:true});
  });
  await page.reload();
  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content','width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no');
  await expect(page.locator('html')).toHaveCSS('touch-action','pan-y');
  await page.getByRole('button',{name:'Settings'}).click();
  await page.evaluate(()=>{
    const event=new Event('beforeinstallprompt',{cancelable:true});
    event.prompt=async()=>{};
    event.userChoice=Promise.resolve({outcome:'accepted'});
    window.dispatchEvent(event);
  });
  await expect(page.getByTestId('install-app')).toHaveCount(0);
});