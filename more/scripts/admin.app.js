const app = {
	// baseUrl:'http://localhost:8080',
	baseUrl:'https://cooperative-tux-worm.cyclic.app',
	body:find('body'),
	app:find('#app'),
	menu:find('#menu'),
	menuParent:find('#menuparent'),
	bodydiv:find('#body'),
	menuButtons:findall('#menu div'),
	topLayer:find('#toplayer'),
	moreMenutButton:find('#moremenutoggle'),
	init(){
		this.menuButtonsInit();
		this.generateHomeContent();
	},
	menuButtonsInit(){
		this.menuButtons.forEach(btn=>{
			btn.onclick = ()=>{
				if(btn.id !== 'HideMenu')
					this.hideAndShow();
				this[`open${btn.id}`]();
			}
		})
		this.moreMenutButton.onclick = ()=>{
			this.menuParent.show('flex');
		}
	},
	hideAndShow(){
		this.body.style.overflow = 'hidden';
		this.topLayer.show('flex');
	},
	openOrder(){
		this.topLayer.replaceChild(view.orderPage());
	},
	openFeedback(state){
		this.topLayer.replaceChild(view.feedbackPage(state));
	},
	openPrice(){
		this.topLayer.replaceChild(view.pricePage());
	},
	openConfig(){
		this.topLayer.replaceChild(view.configPage());
	},
	showOrderCurve(){
		return new Promise(async (resolve,reject)=>{
			//getting visitor data
			const visitor = await new Promise((resolve,reject)=>{
				cOn.get({
					url:`${app.baseUrl}/getordersdata`,
					onload(){
						resolve(this.getJSONResponse());
					}
				})
			})
			this.bodydiv.addChild(view.orderChartInfo(visitor));
			resolve(true);	
		})
		
	},
	showVisitorCurve(){
		return new Promise(async (resolve,reject)=>{
			//getting visitor data
				const visitor = await new Promise((resolve,reject)=>{
					cOn.get({
						url:`${app.baseUrl}/getvisitordata`,
						onload(){
							resolve(this.getJSONResponse());
						}
					})
				})
			this.bodydiv.addChild(view.visitorChartInfo(visitor));	
			resolve(true);
		})
		
	},
	showProfitCurve(){
		return new Promise(async (resolve,reject)=>{
			//getting visitor data
			const visitor = await new Promise((resolve,reject)=>{
				cOn.get({
					url:`${app.baseUrl}/getordersdata`,
					onload(){
						resolve(this.getJSONResponse());
					}
				})
			})
			this.bodydiv.addChild(view.profitChartInfo(visitor));
			resolve(true);	
		})
	},
	openBanner(){
		this.topLayer.replaceChild(view.bannerEdit());
	},
	openVoucher(){
		this.topLayer.replaceChild(view.voucherEdit());
	},
	openDigiDepo(){
		this.topLayer.replaceChild(view.newDigiDepo());
	},
	openBroadcast(){
		this.topLayer.replaceChild(view.sendBroadcast());
	},
	openTopup(){
		this.topLayer.replaceChild(view.topupPage());
	},
	openUsers(){
		this.topLayer.replaceChild(view.usersPage());
	},
	openBrand(){
		this.topLayer.replaceChild(view.brandIcons());
	},
	openNewDepoDetails(param){
		this.topLayer.replaceChild(view.depoDetails(param));
	},
	openDuitkuDisbursement(){
		this.topLayer.replaceChild(view.duitkuDisbursement());
	},
	async generateHomeContent(){
		//statistik, fonnte sended message, digi products, orders count and more.
		await this.showDataStats();
		await this.showVisitorCurve();
		await this.showOrderCurve();
		await this.showProfitCurve();
	},
	showDataStats(){
		return new Promise(async (resolve,reject)=>{
			//getting visitor data
			const stats = await new Promise((resolve,reject)=>{
				cOn.get({
					url:`${app.baseUrl}/getdatastats`,
					onload(){
						resolve(this.getJSONResponse());
					}
				})
			})
			this.bodydiv.addChild(view.statsInfo(stats));
			resolve(true);	
		})
	},
	showWarnings(message){
		this.body.addChild(makeElement('div',{
			style:`
				position: fixed;
		    background: rgb(137, 115, 223);
		    padding: 20px;
		    color: white;
		    border-radius: 10px;
		    display: flex;
		    gap: 15px;
		    align-items: center;
		    top: 10px;
		    right: 10px;
		    max-width: 300px;
		    font-size: 14px;
		    border:1px solid gainsboro;
		    z-index:15;
			`,
			innerHTML:`
				<div>
					<img src=./more/media/warningicon.png>
				</div>
				<div>${message}</div>
			`,
			onadded(){
				setTimeout(()=>{this.remove()},2000);
			}
		}))
	},
	openPaymentDetails(param,param2=false,param3=false){
		this.topLayer.replaceChild(view.paymentDetails(param,param2,param3));
	},
	openUserEditor(param){
		this.topLayer.replaceChild(view.userEditor(param));
	},
	openKategori(){
		this.topLayer.replaceChild(view.kategoriPage());
	},
	openHideMenu(){
		this.menuParent.hide();
	},
	openProduk(){
		this.topLayer.replaceChild(view.products());
	}
}

app.init();
