const appConfig = window.__APP_CONFIG__ || {};
const SUPABASE_URL = appConfig.supabaseUrl || '';
const SUPABASE_ANON_KEY = appConfig.supabaseAnonKey || '';

if (SUPABASE_URL && SUPABASE_ANON_KEY && typeof supabase !== 'undefined') {
  window.supabase = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
} else {
  window.supabase = null;
  console.error('Missing Supabase config. Make sure /config.js is served by the backend and the public anon key is defined in the environment.');
}

document.addEventListener('alpine:init', () => {

  window.t = {
    th: {
      badgeSignIn:'เข้าสู่ระบบ',
      badgeSignUp:'สร้างบัญชีใหม่',
      emailLabel:'อีเมล',
      passwordLabel:'รหัสผ่าน',
      hidePass:'ซ่อน',
      showPass:'แสดง',
      btnSubmitSignIn:'เข้าสู่ระบบ',
      btnSubmitSignUp:'ยืนยันสร้างบัญชี',
      btnLoading:'กำลังดำเนินการ...',
      orDivider:'หรือ',
      toggleToSignUp:'ยังไม่มีบัญชี? สมัครสมาชิกที่นี่',
      toggleToSignIn:'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ',
      navOverview:'หน้าแรก',
      navDashboard:'สรุปผล',
      navCalendar:'ปฏิทิน',
      navSetting:'ตั้งค่า',
      todayOverview:'ภาพรวมวันนี้',
      todayIncome:'รายรับวันนี้',
      todayExpense:'รายจ่ายวันนี้',
      recentTransactions:'รายการธุรกรรม',
      noTransactionsToday:'ยังไม่มีรายการธุรกรรมในวันนี้',
      dashboardTitle:'ภาพรวมการเงิน',
      cardBalance:'คงเหลือสุทธิ',
      cardIncome:'รายรับทั้งหมด',
      cardExpense:'รายจ่ายทั้งหมด',
      cardSavings:'เงินออมสุทธิ',
      financialOverview:'ภาพรวมรายจ่าย',
      incomeTab:'รายรับ',
      expenseTab:'รายจ่าย',
      noChartData:'ยังไม่มีข้อมูล',
      addTransactionTitle:'เพิ่มรายการใหม่',
      typeExpense:'รายจ่าย',
      typeIncome:'รายรับ',
      amountLabel:'จำนวนเงิน (฿)',
      noteLabel:'บันทึกเพิ่มเติม',
      dateLabel:'วันที่รายการ',
      walletLabel:'วิธีชำระเงิน',
      categoryLabel:'หมวดหมู่',
      btnSaveTransaction:'บันทึกรายการ',
      calendarTitle:'ปฏิทินธุรกรรม',
      heatmapBadge:'เทียบงบรายวัน',
      monthBudgetLabel:'งบรายเดือน',
      dailyBudgetLabel:'เป้าหมายรายวัน',
      calendarSpendLabel:'รายจ่าย',
      calendarNoBudget:'ตั้งงบรายเดือนในหน้าตั้งค่าเพื่อดูสถานะสี',
      previousMonth:'เดือนก่อน',
      nextMonth:'เดือนถัดไป',
      weekdays:['อา','จ','อ','พ','พฤ','ศ','ส'],
      heatmapGreen:'ต่ำกว่า 70% ของงบรายวัน',
      heatmapAmber:'ใช้ไป 70% ถึงต่ำกว่า 100%',
      heatmapRed:'ใช้ครบหรือเกินงบรายวัน',
      heatmapEmpty:'ไม่มีรายการในวันนี้',
      settingTitle:'ตั้งค่าระบบ',
      languageHeader:'ภาษา',
      themeHeader:'โหมดการแสดงผล',
      btnSignOut:'ออกจากระบบ',
      deleteConfirmTitle:'ยืนยันการลบรายการ',
      deleteConfirmDesc:'คุณต้องการลบรายการนี้ใช่หรือไม่?',
      cancel:'ยกเลิก',
      confirmDelete:'ลบรายการ',
      quickAmountTitle:'เลือกจำนวนเงินด่วน',
      paymentMethodLabel:'วิธีการชำระเงิน',
      walletCash:'เงินสด',
      walletBank:'ธนาคาร',
      walletCredit:'บัตรเครดิต',
      rangeWeekly:'รายสัปดาห์',
      rangeMonthly:'รายเดือน',
      expenseByCategory:'สัดส่วนรายจ่ายตามหมวดหมู่',
      netThisRange:'คงเหลือสุทธิ',
      swipeHintDelete:'ปัดซ้ายเพื่อลบ',
      subscriptionLabel:'Subscription',
      subscriptionHint:'สร้างรายการอัตโนมัติตามรอบ',
      subscriptionNo:'ไม่ใช่',
      subscriptionYes:'ใช่',
      frequencyLabel:'รอบการเรียกเก็บ',
      daily:'ทุกวัน',
      weekly:'ทุกสัปดาห์',
      monthly:'ทุกเดือน',
      yearly:'ทุกปี',
      subscriptionsTitle:'Subscriptions',
      noSubscriptions:'ยังไม่มี Subscription',
      active:'เปิด',
      inactive:'ปิด',
      toggle:'เปิด/ปิด',
      deleteSubscription:'ลบ',
      subscriptionSaved:'บันทึก Subscription แล้ว',
      editTransactionTitle:'แก้ไขรายการ',
      editSubscriptionTitle:'แก้ไข Subscription',
      saveChanges:'บันทึกการแก้ไข',
      profileLabel:'โปรไฟล์',
      displayNameLabel:'ชื่อที่แสดง',
      saveProfile:'บันทึกโปรไฟล์',
      profileSaved:'บันทึกโปรไฟล์แล้ว',
      profileNameRequired:'กรุณากรอกชื่อที่แสดง',
      monthlyBudgetLabel:'งบรายจ่ายรายเดือน (฿)',
      monthlyBudgetHint:'ใช้คำนวณสถานะรายจ่ายรายวันในปฏิทิน',
      invalidBudget:'กรุณาระบุงบรายเดือนที่มากกว่า 0 หรือเว้นว่าง',
      nextRunDate:'วันที่เริ่มรอบถัดไป',
      editAction:'แก้ไข',
      authOriginRequired:'กรุณาเปิดผ่านเว็บเซิร์ฟเวอร์ ไม่สามารถเข้าสู่ระบบจากไฟล์ index.html โดยตรงได้',
      installApp:'ติดตั้งแอป',
      appInstalled:'ติดตั้งแอปแล้ว'
    },

    en: {
      badgeSignIn:'Sign In',
      badgeSignUp:'Sign Up',
      emailLabel:'Email',
      passwordLabel:'Password',
      hidePass:'Hide',
      showPass:'Show',
      btnSubmitSignIn:'Sign In',
      btnSubmitSignUp:'Create Account',
      btnLoading:'Loading...',
      orDivider:'OR',
      toggleToSignUp:"Don't have an account? Sign Up",
      toggleToSignIn:'Already have an account? Sign In',
      navOverview:'Home',
      navDashboard:'Dashboard',
      navCalendar:'Calendar',
      navSetting:'Settings',
      todayOverview:"Today's Overview",
      todayIncome:'Today Income',
      todayExpense:'Today Expense',
      recentTransactions:'Transactions List',
      noTransactionsToday:'No transactions recorded for this date.',
      dashboardTitle:'Financial Dashboard',
      cardBalance:'Net Balance',
      cardIncome:'Total Income',
      cardExpense:'Total Expense',
      cardSavings:'Net Savings',
      financialOverview:'Expense Overview',
      incomeTab:'Income',
      expenseTab:'Expense',
      noChartData:'No Data Available',
      addTransactionTitle:'Add Transaction',
      typeExpense:'Expense',
      typeIncome:'Income',
      amountLabel:'Amount (฿)',
      noteLabel:'Note',
      dateLabel:'Transaction Date',
      walletLabel:'Payment Method',
      categoryLabel:'Category',
      btnSaveTransaction:'Save Transaction',
      calendarTitle:'Transaction Calendar',
      heatmapBadge:'Daily budget status',
      monthBudgetLabel:'Monthly budget',
      dailyBudgetLabel:'Daily target',
      calendarSpendLabel:'Spent',
      calendarNoBudget:'Set a monthly budget in Settings to see color indicators',
      previousMonth:'Previous month',
      nextMonth:'Next month',
      weekdays:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
      heatmapGreen:'Below 70% of daily budget',
      heatmapAmber:'70% to below 100% spent',
      heatmapRed:'Daily budget reached or exceeded',
      heatmapEmpty:'No transactions recorded',
      settingTitle:'Settings',
      languageHeader:'Language',
      themeHeader:'Display Theme',
      btnSignOut:'Sign Out',
      deleteConfirmTitle:'Confirm Delete',
      deleteConfirmDesc:'Are you sure you want to delete this transaction?',
      cancel:'Cancel',
      confirmDelete:'Delete',
      quickAmountTitle:'Quick Amount Selection',
      paymentMethodLabel:'Payment Method',
      walletCash:'Cash',
      walletBank:'Bank',
      walletCredit:'Credit',
      rangeWeekly:'Weekly',
      rangeMonthly:'Monthly',
      expenseByCategory:'Expense by Category',
      netThisRange:'Net Balance',
      swipeHintDelete:'Swipe left to delete',
      subscriptionLabel:'Subscription',
      subscriptionHint:'Create recurring transactions',
      subscriptionNo:'No',
      subscriptionYes:'Yes',
      frequencyLabel:'Frequency',
      daily:'Daily',
      weekly:'Weekly',
      monthly:'Monthly',
      yearly:'Yearly',
      subscriptionsTitle:'Subscriptions',
      noSubscriptions:'No subscriptions',
      active:'Active',
      inactive:'Inactive',
      toggle:'Toggle',
      deleteSubscription:'Delete',
      subscriptionSaved:'Subscription saved',
      editTransactionTitle:'Edit transaction',
      editSubscriptionTitle:'Edit subscription',
      saveChanges:'Save changes',
      profileLabel:'Profile',
      displayNameLabel:'Display name',
      saveProfile:'Save profile',
      profileSaved:'Profile saved',
      profileNameRequired:'Please enter a display name',
      monthlyBudgetLabel:'Monthly expense budget (฿)',
      monthlyBudgetHint:'Used to calculate each day’s calendar status',
      invalidBudget:'Enter a monthly budget above 0 or leave it blank',
      nextRunDate:'Next run date',
      editAction:'Edit',
      authOriginRequired:'Open the app from its web server. Sign-in cannot return to a local index.html file.',
      installApp:'Install app',
      appInstalled:'App installed'
    }
  };

  Alpine.data('authApp', () => ({

    view:'auth',
    lang:'en',
    darkMode:true,
    t:window.t,

    isSignUp:false,
    email:'',
    password:'',
    showPassword:false,
    loading:false,
    errorMessage:'',
    successMessage:'',
    showAddModal:false,
    editingTransactionId:null,
    editingSubscriptionId:null,

    trxType:'expense',
    trxAmount:'',
    trxNote:'',
    trxWallet:'cash',
    trxDate:new Date().toISOString().split('T')[0],
    selectedCategory:'food',
    trxIsSubscription:false,
    trxFrequency:'monthly',

    isSubmittingTrx:false,

    showDeleteModal:false,
    deleteTargetId:null,

    selectedFilterDate:new Date().toISOString().split('T')[0],
    swipeDateStartX:null,
    swipeDateStartY:null,
    calendarMonth:new Date().toISOString().slice(0,7),

    chartTab:'overview-net',
    chartRange:'weekly',
    chartInstance:null,

    transactions:[],
    subscriptions:[],

    categoryColors:{
      food:'#f97316',
      travel:'#0ea5e9',
      shopping:'#a855f7',
      bills:'#ef4444',
      entertainment:'#ec4899',
      health:'#14b8a6',
      education:'#6366f1',
      other:'#64748b',
      daily:'#22c55e',
      salary:'#16a34a',
      bonus:'#f59e0b'
    },

    categoryColor(id){
      return this.categoryColors[id] || '#94a3b8';
    },

    get expenseCategories(){
      return [
        {
          id:'food',
          name:this.lang==='th'?'อาหาร/กิน':'Food & Drink',
          iconSvg:`<svg class="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18m-6-9h12M5 7h14a2 2 0 012 2v2H3V9a2 2 0 012-2zM4 15h16a2 2 0 012 2v1a2 2 0 01-2 2H4a2 2 0 01-2-2v-1a2 2 0 012-2z"/></svg>`
        },
        {
          id:'travel',
          name:this.lang==='th'?'การเดินทาง':'Transport',
          iconSvg:`<svg class="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7h8m-8 4h8m-9 8h10M5 3h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/></svg>`
        },
        {
          id:'shopping',
          name:this.lang==='th'?'ช้อปปิ้ง':'Shopping',
          iconSvg:`<svg class="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>`
        },
        {
          id:'bills',
          name:this.lang==='th'?'บิล/น้ำไฟ':'Bills & Utilities',
          iconSvg:`<svg class="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`
        },
        {
          id:'entertainment',
          name:this.lang==='th'?'บันเทิง':'Entertainment',
          iconSvg:`<svg class="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 4h16v16H4V4z"/></svg>`
        },
        {
          id:'health',
          name:this.lang==='th'?'สุขภาพ':'Health',
          iconSvg:`<svg class="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`
        },
        {
          id:'education',
          name:this.lang==='th'?'การศึกษา':'Education',
          iconSvg:`<svg class="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>`
        },
        {
          id:'other',
          name:this.lang==='th'?'อื่นๆ':'Other',
          iconSvg:`<svg class="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/></svg>`
        }
      ];
    },

    get incomeCategories(){
      return [
        {
          id:'daily',
          name:this.lang==='th'?'รายวัน':'Daily',
          iconSvg:`<svg class="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
        },
        {
          id:'salary',
          name:this.lang==='th'?'เงินเดือน':'Salary',
          iconSvg:`<svg class="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`
        },
        {
          id:'bonus',
          name:this.lang==='th'?'โบนัส':'Bonus',
          iconSvg:`<svg class="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>`
        }
      ];
    },

    get quickAmounts(){
      if(this.trxType==='income'){
        if(this.selectedCategory==='daily'){
          return [50,100,200,300,500,1000];
        }
        if(this.selectedCategory==='salary'){
          return [12000,15000,18000,20000,22000,25000];
        }
        return [500,1000,2000,3000,5000,10000];
      }
      return [50,100,200,300,500,1000];
    },

    get rangeFilteredTransactions(){
      const now=new Date();
      return this.transactions.filter(item=>{
        const d=new Date(item.occurred_at);
        if(this.chartRange==='weekly'){
          const start=new Date(now);
          const day=start.getDay();
          const diff=day===0?-6:1-day;
          start.setDate(start.getDate()+diff);
          start.setHours(0,0,0,0);
          return d>=start;
        }
        return d.getFullYear()===now.getFullYear() && d.getMonth()===now.getMonth();
      });
    },

    get rangeSummary(){
      const income=this.rangeFilteredTransactions
        .filter(i=>i.type==='income')
        .reduce((s,i)=>s+Number(i.amount),0);

      const expense=this.rangeFilteredTransactions
        .filter(i=>i.type==='expense')
        .reduce((s,i)=>s+Number(i.amount),0);

      const balance=income-expense;

      return {
        income,
        expense,
        balance,
        savings:balance>0?balance:0
      };
    },

    get expenseByCategory(){
      const totals={};
      this.rangeFilteredTransactions
        .filter(t=>t.type==='expense')
        .forEach(t=>{
          totals[t.category]=(totals[t.category]||0)+Number(t.amount);
        });

      return Object.entries(totals)
        .map(([id,total])=>({
          id,
          name:this.getCategoryName(id),
          total,
          color:this.categoryColor(id)
        }))
        .sort((a,b)=>b.total-a.total);
    },

    get filteredTransactions(){
      return this.transactions.filter(item=>{
        return this.transactionDate(item)===this.selectedFilterDate;
      });
    },

    get filteredIncome(){
      return this.filteredTransactions
        .filter(i=>i.type==='income')
        .reduce((s,i)=>s+Number(i.amount),0);
    },

    get filteredExpense(){
      return this.filteredTransactions
        .filter(i=>i.type==='expense')
        .reduce((s,i)=>s+Number(i.amount),0);
    },

    get calendarMonthLabel(){
      const [year,month]=this.calendarMonth.split('-').map(Number);
      return new Date(Date.UTC(year,month-1,15)).toLocaleDateString(
        this.lang==='th'?'th-TH':'en-US',
        {month:'long',year:'numeric',timeZone:'UTC'}
      );
    },

    get calendarDailyBudget(){
      const [year,month]=this.calendarMonth.split('-').map(Number);
      const monthlyBudget=Number(this.monthlyExpenseBudget);
      if(!Number.isFinite(monthlyBudget)||monthlyBudget<=0) return 0;
      return monthlyBudget/new Date(Date.UTC(year,month,0)).getUTCDate();
    },

    get calendarCells(){
      const [year,month]=this.calendarMonth.split('-').map(Number);
      const dayCount=new Date(Date.UTC(year,month,0)).getUTCDate();
      const firstWeekday=new Date(Date.UTC(year,month-1,1)).getUTCDay();
      const cells=Array.from({length:firstWeekday},(_,index)=>({key:`blank-${index}`,day:null}));

      for(let day=1;day<=dayCount;day++){
        const date=[year,String(month).padStart(2,'0'),String(day).padStart(2,'0')].join('-');
        const dayTransactions=this.transactions.filter(item=>this.transactionDate(item)===date);
        const expense=dayTransactions
          .filter(item=>item.type==='expense')
          .reduce((total,item)=>total+Number(item.amount),0);
        let status='empty';

        if(dayTransactions.length&&this.calendarDailyBudget>0){
          const greenLimit=Math.round(this.calendarDailyBudget*0.7*100)/100;
          const dailyLimit=Math.round(this.calendarDailyBudget*100)/100;
          status=expense<greenLimit?'green':expense<dailyLimit?'amber':'red';
        }

        const dateValue=new Date(Date.UTC(year,month-1,day));
        const dateLabel=dateValue.toLocaleDateString(
          this.lang==='th'?'th-TH':'en-US',
          {weekday:'long',year:'numeric',month:'long',day:'numeric',timeZone:'UTC'}
        );
        const statusLabel=status==='green'
          ?this.t[this.lang].heatmapGreen
          :status==='amber'
          ?this.t[this.lang].heatmapAmber
          :status==='red'
          ?this.t[this.lang].heatmapRed
          :!this.monthlyExpenseBudget
          ?this.t[this.lang].calendarNoBudget
          :this.t[this.lang].heatmapEmpty;

        cells.push({
          key:date,
          day:{day,date,expense,hasTransactions:dayTransactions.length>0,status,dateLabel,statusLabel}
        });
      }

      return cells;
    },

    transactionDate(item){
      if(!item) return '';
      if(item.occurred_at){
        return new Date(item.occurred_at).toISOString().split('T')[0];
      }
      return '';
    },

    getSupabaseClient(){
      if(!window.supabase){
        const message = this.t?.[this.lang]?.authOriginRequired || 'Open the app from a web server to use Supabase.';
        this.errorMessage = message;
        throw new Error(message);
      }
      return window.supabase;
    },

    async init(){
      const standalone=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
      if(standalone){
        const viewport=document.querySelector('meta[name="viewport"]');
        if(viewport) viewport.content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no';
        document.documentElement.style.touchAction='pan-y';
      }
      if('serviceWorker' in navigator&&['http:','https:'].includes(window.location.protocol)){
        navigator.serviceWorker.register('/service-worker.js').catch(error=>console.error('PWA registration failed:',error));
      }
      try{
        const client=this.getSupabaseClient();
        const { data:{session} } = await client.auth.getSession();
        if(session){
          this.view='overview';
          await this.loadUserData();
        }

        client.auth.onAuthStateChange(async(event,session)=>{
          if(event==='SIGNED_IN' && session){
            this.errorMessage='';
            this.view='overview';
            await this.loadUserData();
          }
          if(event==='SIGNED_OUT'){
            this.view='auth';
            this.transactions=[];
            this.subscriptions=[];
          }
        });
      }catch(err){
        this.errorMessage = err.message || this.t?.[this.lang]?.authOriginRequired || 'Open the app from a web server to use Supabase.';
        this.view='auth';
      }
    },

    async loadUserData(){
      const client=this.getSupabaseClient();
      const results=await Promise.allSettled([
        this.fetchUserProfile(),
        this.fetchTransactions(),
        this.fetchSubscriptions()
      ]);
      const failed=results.find(result=>result.status==='rejected');
      if(failed) this.errorMessage=failed.reason?.message||'Unable to load account data';
    },

    async fetchTransactions(){
      try{
        const client=this.getSupabaseClient();
        const { data: { session } } = await client.auth.getSession();
        const user=session?.user;
        if(!user) return;

        const { data, error } = await client
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('occurred_at', { ascending: false })
          .order('created_at', { ascending: false });

        if(error) throw error;
        this.transactions = data || [];

        if(this.view==='dashboard'){
          this.$nextTick(()=>this.renderChart());
        }
      }catch(err){
        console.error(err);
        this.errorMessage=err.message;
      }
    },

    async fetchSubscriptions(){
      try{
        const client=this.getSupabaseClient();
        const { data: { session } } = await client.auth.getSession();
        const user=session?.user;
        if(!user) return;

        const { data, error } = await client
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('next_run_at', { ascending: true });

        if(error) throw error;
        this.subscriptions = data || [];
      }catch(err){
        console.error('Subscription error:',err);
      }
    },

    // 1. เพิ่ม State ใหม่ใน Alpine data
    userEmail: '',
    displayName: '',
    monthlyExpenseBudget:'',
    isUpdatingProfile: false,

    // 2. ปรับปรุง fetchUserProfile() ให้ดึง Email และ Display Name
    async fetchUserProfile(){
      const client=this.getSupabaseClient();
      const { data:{session} } = await client.auth.getSession();
      const user=session?.user;
      if(!user) return;

      this.userEmail = user.email || '';

      const { data, error } = await client
        .from('profiles')
        .select('display_name, lang, theme, monthly_expense_budget')
        .eq('id', user.id)
        .maybeSingle();

      if(error) throw error;

      if(data){
        if(data.lang) this.lang = data.lang;
        if(data.theme) this.darkMode = data.theme === 'dark';
        this.monthlyExpenseBudget=data.monthly_expense_budget===null
          ?''
          :String(data.monthly_expense_budget??'');
        
        // ตั้งค่าชื่อผู้ใช้ (ถ้าใน profiles ยังว่างอยู่ ให้ดึงจาก metadata หรือตัดคำหน้า @ จาก email)
        const fallbackName = user.user_metadata?.full_name || user.user_metadata?.name || this.userEmail.split('@')[0];
        this.displayName = data.display_name || fallbackName;
      } else {
        const defaultName = user.user_metadata?.full_name || user.user_metadata?.name || this.userEmail.split('@')[0];
        this.displayName = defaultName;
        
        const { error:upsertError } = await client
          .from('profiles')
          .upsert({
            id: user.id,
            display_name: defaultName,
            lang: this.lang,
            theme: this.darkMode ? 'dark' : 'light',
            monthly_expense_budget:null,
            updated_at: new Date().toISOString()
          });
        if(upsertError) throw upsertError;
      }
    },

    // 3. เพิ่มฟังก์ชันสำหรับกดบันทึกการแก้ไขชื่อผู้ใช้
    async updateProfileName(){
      const displayName=this.displayName.trim();
      const monthlyBudget=this.monthlyExpenseBudget===''||this.monthlyExpenseBudget===null
        ?null
        :Number(this.monthlyExpenseBudget);
      if(!displayName){
        this.errorMessage=this.t[this.lang].profileNameRequired;
        return;
      }
      if(monthlyBudget!==null&&(!Number.isFinite(monthlyBudget)||monthlyBudget<=0||monthlyBudget>100000000)){
        this.errorMessage=this.t[this.lang].invalidBudget;
        return;
      }
      this.isUpdatingProfile = true;
      try {
        const client=this.getSupabaseClient();
        const { data:{session} } = await client.auth.getSession();
        const user=session?.user;
        if(!user) return;

        const { error } = await client
          .from('profiles')
          .update({
            display_name: displayName,
            monthly_expense_budget:monthlyBudget,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if(error) throw error;
        this.displayName=displayName;
        this.monthlyExpenseBudget=monthlyBudget===null?'':String(monthlyBudget);
        this.errorMessage='';
        this.successMessage=this.t[this.lang].profileSaved;
      } catch(err) {
        console.error(err);
        this.errorMessage = err.message;
      } finally {
        this.isUpdatingProfile = false;
      }
    },

    async toggleLang(){
      const previous=this.lang;
      this.lang=this.lang==='th'?'en':'th';
      try{
        const client=this.getSupabaseClient();
        const { data:{session} } = await client.auth.getSession();
        if(session?.user){
          const {error}=await client
            .from('profiles')
            .update({lang:this.lang,updated_at:new Date().toISOString()})
            .eq('id',session.user.id);
          if(error) throw error;
        }
      }catch(err){
        this.lang=previous;
        this.errorMessage=err.message;
      }
      if(this.view==='dashboard'){
        this.$nextTick(()=>this.renderChart());
      }
    },

    async toggleTheme(){
      const previous=this.darkMode;
      this.darkMode=!this.darkMode;
      try{
        const client=this.getSupabaseClient();
        const { data:{session} } = await client.auth.getSession();
        if(session?.user){
          const {error}=await client
            .from('profiles')
            .update({theme:this.darkMode?'dark':'light',updated_at:new Date().toISOString()})
            .eq('id',session.user.id);
          if(error) throw error;
        }
      }catch(err){
        this.darkMode=previous;
        this.errorMessage=err.message;
      }
      if(this.view==='dashboard'){
        this.$nextTick(()=>this.renderChart());
      }
    },

    openAddModal(){
      this.editingTransactionId=null;
      this.editingSubscriptionId=null;
      this.trxAmount='';
      this.trxNote='';
      this.trxWallet='cash';
      this.trxDate=new Date().toISOString().split('T')[0];
      this.trxIsSubscription=false;
      this.trxFrequency='monthly';
      this.showAddModal=true;
    },

    editTransaction(item){
      this.editingTransactionId=item.id;
      this.editingSubscriptionId=null;
      this.trxType=item.type;
      this.trxAmount=String(item.amount);
      this.trxNote=item.note||'';
      this.trxWallet=item.payment_method;
      this.trxDate=this.transactionDate(item);
      this.selectedCategory=item.category;
      this.trxIsSubscription=Boolean(item.is_subscription);
      this.showAddModal=true;
    },

    editSubscription(item){
      this.editingTransactionId=null;
      this.editingSubscriptionId=item.id;
      this.trxType=item.type;
      this.trxAmount=String(item.amount);
      this.trxNote=item.note||'';
      this.trxWallet=item.payment_method;
      this.trxDate=new Date(item.next_run_at).toISOString().split('T')[0];
      this.selectedCategory=item.category;
      this.trxIsSubscription=true;
      this.trxFrequency=item.frequency;
      this.showAddModal=true;
    },

    selectCategory(id){
      this.selectedCategory=id;
      const first=this.quickAmounts[0];
      if(first) this.trxAmount=first;
    },

    async saveTransaction(){
      const amount=Number(this.trxAmount);
      if(!Number.isFinite(amount)||amount<=0){
        this.errorMessage=this.lang==='th'?'กรุณาระบุจำนวนเงินที่ถูกต้อง':'Please enter a valid amount';
        return;
      }

      this.isSubmittingTrx=true;
      this.errorMessage='';
      this.successMessage='';
      let transactionSaved=false;

      try{
        const client=this.getSupabaseClient();
        const { data: { session } } = await client.auth.getSession();
        const user=session?.user;
        if(!user) throw new Error('User not authenticated');

        if(this.editingSubscriptionId){
          const { data, error } = await client
            .from('subscriptions')
            .update({
              type:this.trxType,
              category:this.selectedCategory,
              amount,
              payment_method:this.trxWallet,
              note:this.trxNote||'',
              frequency:this.trxFrequency,
              next_run_at:`${this.trxDate}T12:00:00Z`
            })
            .eq('id',this.editingSubscriptionId)
            .eq('user_id',user.id)
            .select('*')
            .single();

          if(error) throw error;
          this.subscriptions=this.subscriptions.map(item=>item.id===data.id?data:item);
          this.showAddModal=false;
          this.editingSubscriptionId=null;
          return;
        }

        const payload={
          user_id: user.id,
          type:this.trxType,
          category:this.selectedCategory,
          amount,
          payment_method:this.trxWallet,
          is_subscription:this.trxIsSubscription,
          note:this.trxNote||'',
          occurred_at:`${this.trxDate}T12:00:00Z`
        };

        const query=this.editingTransactionId
          ?client.from('transactions')
            .update(payload)
            .eq('id',this.editingTransactionId)
            .eq('user_id',user.id)
          :client.from('transactions').insert(payload);

        const { data, error } = await query.select('*').single();

        if(error) throw error;
        if(this.editingTransactionId){
          this.transactions=this.transactions.map(item=>item.id===data.id?data:item);
        }else{
          this.transactions.unshift(data);
          transactionSaved=true;
        }

        if(this.trxIsSubscription&&!this.editingTransactionId){
          const { error:subscriptionError }=await client.from('subscriptions').insert({
            user_id: user.id,
            type:this.trxType,
            category:this.selectedCategory,
            amount,
            payment_method:this.trxWallet,
            note:this.trxNote||'',
            frequency:this.trxFrequency,
            next_run_at:`${this.trxDate}T12:00:00Z`,
            is_active: true
          });
          if(subscriptionError) throw subscriptionError;
          await this.fetchSubscriptions();
        }

        this.showAddModal=false;
        this.editingTransactionId=null;
        if(this.view==='dashboard'){
          this.$nextTick(()=>this.renderChart());
        }

      }catch(err){
        console.error('Save error:',err);
        if(transactionSaved){
          this.showAddModal=false;
          this.editingTransactionId=null;
          this.errorMessage=this.lang==='th'
            ?`บันทึกรายการแล้ว แต่สร้าง Subscription ไม่สำเร็จ: ${err.message}`
            :`Transaction saved, but the subscription could not be created: ${err.message}`;
        }else{
          this.errorMessage=err.message||'บันทึกรายการไม่สำเร็จ';
        }
      }finally{
        this.isSubmittingTrx=false;
      }
    },

    promptDelete(id){
      this.deleteTargetId=id;
      this.showDeleteModal=true;
    },

    async confirmDeleteTransaction(){
      const id=this.deleteTargetId;
      this.showDeleteModal=false;
      this.deleteTargetId=null;

      try{
        const client=this.getSupabaseClient();
        const { error } = await client
          .from('transactions')
          .delete()
          .eq('id', id);

        if(error) throw error;
        this.transactions=this.transactions.filter(item=>item.id!==id);

        if(this.view==='dashboard'){
          this.$nextTick(()=>this.renderChart());
        }
      }catch(err){
        this.errorMessage=err.message;
      }
    },

    async toggleSubscription(id){
      try{
        const client=this.getSupabaseClient();
        const sub = this.subscriptions.find(s=>s.id===id);
        if(!sub) return;

        const { error } = await client
          .from('subscriptions')
          .update({ is_active: !sub.is_active })
          .eq('id', id);

        if(error) throw error;
        await this.fetchSubscriptions();
      }catch(err){
        this.errorMessage=err.message;
      }
    },

    async deleteSubscription(id){
      if(!confirm(this.lang==='th'?'ลบ Subscription นี้หรือไม่?':'Delete this subscription?')){
        return;
      }
      try{
        const client=this.getSupabaseClient();
        const { error } = await client
          .from('subscriptions')
          .delete()
          .eq('id', id);

        if(error) throw error;
        await this.fetchSubscriptions();
      }catch(err){
        this.errorMessage=err.message;
      }
    },

    getCategoryName(id){
      const all=[...this.expenseCategories,...this.incomeCategories];
      const found=all.find(c=>c.id===id);
      return found?found.name:id;
    },

    getCategoryIcon(id){
      const all=[...this.expenseCategories,...this.incomeCategories];
      const found=all.find(c=>c.id===id);
      return found?found.iconSvg:'<span class="text-xs">•</span>';
    },

    getWalletIcon(wallet){
      if(wallet==='bank') return `<svg class="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>`;
      if(wallet==='credit') return `<svg class="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`;
      return `<svg class="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`;
    },

    getWalletLabel(wallet){
      if(wallet==='bank') return this.t[this.lang].walletBank;
      if(wallet==='credit') return this.t[this.lang].walletCredit;
      return this.t[this.lang].walletCash;
    },

    shiftDate(days){
      const [year,month,day]=this.selectedFilterDate.split('-').map(Number);
      const nextDate=new Date(Date.UTC(year,month-1,day+days));
      this.selectedFilterDate=[
        nextDate.getUTCFullYear(),
        String(nextDate.getUTCMonth()+1).padStart(2,'0'),
        String(nextDate.getUTCDate()).padStart(2,'0')
      ].join('-');
    },

    onDateSwipeStart(e){
      if(e.target.closest('button,input,select,textarea')) return;
      const touch=e.touches[0];
      if(!touch) return;
      this.swipeDateStartX=touch.clientX;
      this.swipeDateStartY=touch.clientY;
    },

    onDateSwipeEnd(e){
      if(this.swipeDateStartX===null||this.swipeDateStartY===null) return;
      const touch=e.changedTouches[0];
      if(!touch) return;
      const deltaX=touch.clientX-this.swipeDateStartX;
      const deltaY=touch.clientY-this.swipeDateStartY;
      if(Math.abs(deltaX)>40&&Math.abs(deltaX)>Math.abs(deltaY)*1.2&&deltaX>0){
        this.shiftDate(-1);
      }else if(Math.abs(deltaX)>40&&Math.abs(deltaX)>Math.abs(deltaY)*1.2&&deltaX<0){
        this.shiftDate(1);
      }
      this.swipeDateStartX=null;
      this.swipeDateStartY=null;
    },

    openCalendar(){
      this.calendarMonth=this.selectedFilterDate.slice(0,7);
      this.view='calendar';
    },

    shiftCalendarMonth(offset){
      const [year,month]=this.calendarMonth.split('-').map(Number);
      const nextMonth=new Date(Date.UTC(year,month-1+offset,1));
      this.calendarMonth=[
        nextMonth.getUTCFullYear(),
        String(nextMonth.getUTCMonth()+1).padStart(2,'0')
      ].join('-');
    },

    selectCalendarDay(date){
      this.selectedFilterDate=date;
      this.calendarMonth=date.slice(0,7);
      this.view='overview';
    },

    setChartRange(range){
      this.chartRange=range;
      this.$nextTick(()=>this.renderChart());
    },

    renderChart(){
      const canvas=document.getElementById('financialOverviewChart');
      if(!canvas||typeof Chart==='undefined') return;

      if(this.chartInstance){
        this.chartInstance.destroy();
      }

      const breakdown=this.expenseByCategory;
      const net=this.rangeSummary.balance;

      const centerTextPlugin={
        id:'centerText',
        afterDraw:chart=>{
          const {ctx,chartArea}=chart;
          if(!chartArea) return;

          const cx=chartArea.left+chartArea.width/2;
          const cy=chartArea.top+chartArea.height/2;

          ctx.save();
          ctx.textAlign='center';
          ctx.textBaseline='middle';
          ctx.font='700 17px ui-sans-serif,system-ui';
          ctx.fillStyle=this.darkMode?'#F1F5F9':'#1E293B';
          ctx.fillText('฿'+Math.abs(net).toLocaleString(),cx,cy-8);

          ctx.font='500 10px ui-sans-serif,system-ui';
          ctx.fillStyle=this.darkMode?'#94A3B8':'#64748B';
          ctx.fillText(this.t[this.lang].netThisRange,cx,cy+11);
          ctx.restore();
        }
      };

      if(breakdown.length===0){
        this.chartInstance=new Chart(canvas,{
          type:'doughnut',
          data:{
            labels:[this.t[this.lang].noChartData],
            datasets:[{
              data:[1],
              backgroundColor:[this.darkMode?'#334155':'#E2E8F0'],
              borderWidth:0
            }]
          },
          options:{
            cutout:'72%',
            plugins:{legend:{display:false},tooltip:{enabled:false}},
            responsive:true,
            maintainAspectRatio:false
          }
        });
        return;
      }

      this.chartInstance=new Chart(canvas,{
        type:'doughnut',
        data:{
          labels:breakdown.map(c=>c.name),
          datasets:[{
            data:breakdown.map(c=>c.total),
            backgroundColor:breakdown.map(c=>c.color),
            borderWidth:0,
            borderRadius:8,
            spacing:3,
            hoverOffset:6
          }]
        },
        options:{
          cutout:'72%',
          plugins:{
            legend:{display:false},
            tooltip:{
              callbacks:{
                label:item=>` ${item.label}: ฿${Number(item.raw).toLocaleString()}`
              }
            }
          },
          responsive:true,
          maintainAspectRatio:false
        },
        plugins:[centerTextPlugin]
      });
    },

    authRedirectUrl(currentHref=window.location.href){
      const currentUrl=new URL(currentHref);
      if(!['http:','https:'].includes(currentUrl.protocol)){
        this.errorMessage=this.t[this.lang].authOriginRequired;
        return null;
      }
      return new URL('./',currentUrl).toString();
    },

    async handleSubmit(){
      this.loading=true;
      this.errorMessage='';
      this.successMessage='';

      try{
        const client=this.getSupabaseClient();
        if(this.isSignUp){
          const redirectTo=this.authRedirectUrl();
          if(!redirectTo) return;
          const {error}=await client.auth.signUp({
            email:this.email,
            password:this.password,
            options:{
              emailRedirectTo:redirectTo
            }
          });
          if(error) throw error;
          this.successMessage=this.lang==='th'?'สมัครสำเร็จ ตรวจสอบอีเมลเพื่อยืนยัน':'Account created. Please check your email.';
          this.isSignUp=false;
        }else{
          const {error}=await client.auth.signInWithPassword({
            email:this.email,
            password:this.password
          });
          if(error) throw error;
        }
      }catch(err){
        this.errorMessage=err.message;
      }finally{
        this.loading=false;
      }
    },

    async loginWithGoogle(){
      this.errorMessage='';
      const redirectTo=this.authRedirectUrl();
      if(!redirectTo) return;
      try{
        const client=this.getSupabaseClient();
        const {error}=await client.auth.signInWithOAuth({
          provider:'google',
          options:{redirectTo}
        });
        if(error) throw error;
      }catch(err){
        this.errorMessage=err.message;
      }
    },

    async logout(){
      try{
        const client=this.getSupabaseClient();
        await client.auth.signOut();
      }catch(err){
        this.errorMessage=err.message;
      }
      this.view='auth';
      this.transactions=[];
      this.subscriptions=[];
    }

  }));

});