const app = {
	// baseUrl:'http://localhost:8080',
	baseUrl:'https://topgames.vercel.app',
	usernameCheckerUrl:'https://api.kitadigital.my.id/api/game',
	webtitle:find('title'),
	headertitle:find('.bigtitle'),
	theslogan:find('.theslogan'),
	homelabel:find('#beranda'),
	footer:find('#footer'),
	body:find('body'),
	development:true,
	app:find('#app'),
	menu:find('#menu'),
	bottomNav:find('#bottomNav'),
	menuLogin:find('#menulogin'),
	bodydiv:find('#body'),
	menuButtons:null,
	topLayer:find('#toplayer'),
	carouselParent:find('.owl-carousel'),
	moremenu:find('#moremenu'),
	cart:find('#cart'),
	toolsparent:find('#toolsparent'),
	finderInput:find('#finderInput'),
	async init(){
		this.openInitLoading();
		this.provideScurities();
		await this.handleFrontData();
		let {products,paymentMethods,carousel,valid,categories} = await this.getPriceList();
		if(!valid){
			const old = this.getOldList();
			products = old.products;
			paymentMethods = old.paymentMethods;
			carousel = old.carousel;
			categories = old.categories;
		}else{
			this.saveOldList({products,paymentMethods,carousel,categories});
		}
		this.products = products;
		this.paymentMethods = paymentMethods;
		this.carousel = carousel;
		this.categories = categories;
		this.loginMenuEventInit();
		this.menuButtonsInit();
		this.bottomNavEventInit();
		this.openMoreMenuInit();
		this.generateBanner();
		this.generateRandomProduct('');
		// this.handleCustomerSupport();
		//record guest
		await this.handleVisitor();
		this.removeInitLoading();
		// this.startNotifMovement();
		this.initSearchInput()

		// this.generateTools();
		this.getLogData();
		this.updateCartData();
		this.navigationInitiator(window);
		location.hash = 'Home';
	},
	startNotifMovement(){
		const notif = find('#notif');
		const notifdiv = notif.find('#notif div div');
		const charlen = notifdiv.innerText.length;
		let shouldMove = true;
		notifdiv.parentElement.onmouseover = ()=>{
			shouldMove = false;
		}
		notifdiv.parentElement.onmouseleave = ()=>{
			shouldMove = true;
		}
		let margin = 0;
		const frame = ()=>{
			if(shouldMove){
				margin += 1;
				notifdiv.style.marginLeft = `${margin}px`;
				if(margin >= 480)
					margin = -charlen * 10;
			}
			requestAnimationFrame(frame);
		}
		frame();
	},
	openInitLoading(){
		this.initLoading = this.body.addChild(view.initLoading());
	},
	removeInitLoading(){
		this.initLoading.remove();
	},
	menuButtonsInit(){
		this.sortedCategories = [];

		Object.keys(this.categories).forEach((key)=>{
			this.sortedCategories[this.categories[key] - 1] = key;
		})
		this.sortedCategories.forEach((key)=>{
			this.menu.addChild(makeElement('div',{
				innerHTML:key,
				onclick(){
					// app.openEtalase(key);
					app.generateRandomProduct(key);
				}
			}))
		})
	},
	handleFrontData(){
		return new Promise((resolve,reject)=>{
			cOn.get({
				url:`${this.baseUrl}/getfrontdata`,
				onload(){
					const response = this.getJSONResponse();
					console.log(response);
					app.setFrontView(response);
					resolve(true);
				}
			})
		})
	},
	setFrontView(param){
		/*
			param [webtitle, headertitle, theslogan, homelabel, footer]
		*/
		if(!param)
			return;
		this.webtitle.innerHTML = param.webtitle;
		this.headertitle.innerHTML = param.headertitle;
		this.theslogan.innerHTML = param.theslogan;
		this.homelabel.innerHTML = param.homelabel;
		this.footer.innerHTML = param.footer;
	},
	getOldList(){
		return JSON.parse(localStorage.getItem('easyolddata'));
	},
	saveOldList(param){
		localStorage.setItem('easyolddata',JSON.stringify(param));
	},
	openPulsa(){
		this.topLayer.replaceChild(view.pulsaProducts());
	},
	openData(){
		this.topLayer.replaceChild(view.dataProducts());
	},
	openHistory(){
		this.topLayer.replaceChild(view.transactionHistories());
	},
	openGames(){
		this.topLayer.replaceChild(view.gameProducts());
	},
	openPLN(){
		this.topLayer.replaceChild(view.plnProducts());
	},
	openEmoney(){
		this.topLayer.replaceChild(view.emoneyProducts());
	},
	hideAndShow(){
		this.body.style.overflow = 'hidden';
		this.topLayer.show('flex');
	},
	topLayerClose(){
		this.topLayer.hide();
		this.body.style.overflow = 'auto';
	},
	detailsProductData:null,
	openDetailsProduct(productId='defaultid'){
		this.detailsProductData = productId;
		location.hash = 'Details';
	},
	openProductDetails(){
		this.hideAndShow();
		this.topLayerSetBackground();
		this.topLayer.replaceChild(view.productDetails(this.detailsProductData));
	},
	confirmAction(param){
		this.body.addChild(view.confirmAction(param));
	},
	openTransactionHistoriesSettings(){
		this.body.addChild(view.transactionSettings());
	},
	openPaymentDetails(param,param2=false){
		this.paymentDetailsData = [param,param2];
		location.hash = 'Detailspayment';
	},
	openShowPaymentDetails(){
		this.topLayer.replaceChild(view.paymentDetails(this.paymentDetailsData[0],this.paymentDetailsData[1]));
	},
	openFeedBackSender(param){
		this.body.addChild(view.feedBack(param));
	},
	openGuaranteeType(param){
		this.body.addChild(view.guaranteeType(param));
	},
	getSaldoId(){
		this.body.addChild(view.getSaldoId());
	},
	clearHistory(){
		const sure = confirm('Sistem akan menghapus histori transaksi anda! Apakah anda yakin?');
		if(sure){
			localStorage.removeItem('easypulsatransactionhistories');
			this.showWarnings('Histori Transaksi Berhasil Dihapus!');
		}
	},
	getPriceList(){
		return new Promise((resolve,reject)=>{
			cOn.get({
				url:`${this.baseUrl}/pricelist`,
				onload(){
					resolve(this.getJSONResponse());
				}
			})
		});
	},
	pushNewTransactionData(param){
		const oldData = JSON.parse(localStorage.getItem('easypulsatransactionhistories'))||[];
		oldData.push(param);
		localStorage.setItem('easypulsatransactionhistories',JSON.stringify(oldData));
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
		    z-index:20;
		    background-color: #d7f5fc;
		    border-color: #b3edf9;
		    color: #03c3ec;
			`,
			innerHTML:`
				<div>
					<img src=./more/media/warning.png width=24>
				</div>
				<div>${message}</div>
			`,
			onadded(){
				setTimeout(()=>{this.remove()},2000);
			}
		}))
	},
	handleCustomerSupport(){
		this.body.addChild(view.customerSupport());
	},
	openCsInput(){
		this.body.addChild(view.csInput());
	},
	order(){

	},
	handleVisitor(){
		return new Promise(async (resolve,reject)=>{
			const dateStamp = new Date().toLocaleString('en-US',{ timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).split(' ')[0] + ' 00:00:00 AM';
			const timeString = Date.parse(dateStamp);
			const savedStamp = JSON.parse(localStorage.getItem('easypulsaloadtime'))||{};
			const ip = await new Promise((resolve,reject)=>{
				cOn.get({
					url:'https://api.ipify.org/?format=json',
					onload(){
						if(!this.getJSONResponse().ip)
							return resolve(null);
						resolve(this.getJSONResponse().ip.replaceAll('.','-'));
					}
				})
			})
			if(!ip)
				return resolve(true);

			if(!savedStamp[timeString]){
				// send server
				cOn.post({
					url:`${app.baseUrl}/addmorevisitor`,
					someSettings:[['setRequestHeader','content-type','application/json']],
					data:jsonstr({ip,timeString}),
					onload(){
						const obj = {};
						obj[timeString] = true;
						localStorage.setItem('easypulsaloadtime',JSON.stringify(obj));
						resolve(true);
					}
				})
			}else{
				resolve(true);
			}
		})
	},
	provideScurities(){
		document.onkeydown = (e)=>{
			if(!this.development && e.key === 'F12'){
				this.showWarnings('Galat!!!<br>Akses terbatas!');
				e.preventDefault();	
			}
		}
		//some defense code.
		if(!this.development){
			document.oncontextmenu = (e)=>{
				this.showWarnings('Galat!!!<br>Akses terbatas!');
				e.preventDefault();
			}
		}
	},
	generateRandomProduct(key){
		const brands = this.products[!key ? this.sortedCategories[0] : key];
		this.bodydiv.replaceChild(view.randomProducts(!key ? this.sortedCategories[0] : key));
	},
	generateBanner(){
		for(let i in this.carousel){
			const carousel = this.carousel[i];
			if(carousel.active){
				this.carouselParent.addChild(makeElement('div',{
					innerHTML:`
						<img src="${carousel.bannerUrl}">
					`,command:carousel.command.split(' '),
					onadded(){
						if(this.command.length === 3)
							this.command[1] = this.command[1]+' '+this.command[2];
					},
					onclick(){
						const category = this.command[0][0].toUpperCase() + this.command[0].toLowerCase().slice(1);
						const brand = this.command[1][0].toUpperCase() + this.command[1].toLowerCase().slice(1);
						app.openDetailsProduct({
							title:`${category + ' ' +brand}`,
							details:app.products[this.command[0]][this.command[1]].details,
							products:app.products[this.command[0]][this.command[1]].data
						});
					}
				}))
			}
		}
		$('.owl-carousel').owlCarousel({
      loop:true,
      margin:0,
      nav:false,
      dots:false,
      items:1,
      // stagePadding:30,
    });
    let isHover = false;
    $('.owl-carousel').mouseover(()=>{
      isHover = true;
    })
    $('.owl-carousel').mouseout(()=>{
      isHover = false;
    })
    setInterval(()=>{
      if(!isHover)
        $('.owl-carousel').trigger('next.owl.carousel',[1000]);
    },2000)
	},
	openLogin(){
		this.topLayer.replaceChild(view.loginPage());
	},
	openRegis(){
		this.topLayer.replaceChild(view.regisPage());
	},
	loginMenuEventInit(){
		this.menuLogin.findall('div').forEach((div)=>{
			div.onclick = ()=>{
				this.hideAndShow();
				this.topLayerSetBackground();
				this[`open${div.id}`]();
			}
		})
	},
	openCallcs(){
		this.topLayer.replaceChild(view.callCsPage());
	},
	openHome(){
		this.updateCartData();
		this.topLayerClose();
	},
	openCekpesanan(){
		this.topLayer.replaceChild(view.cekPesanan());
	},
	bottomNavEventInit(){
		this.bottomNav.findall('div').forEach((div)=>{
			div.onclick = ()=>{
				// this.hideAndShow();
				// this.topLayerSetBackground();
				// this[`open${div.id}`]();
				if(div.id === 'Cekpesanan'){
					if(this.isLogin){
						this.isTrxState = true;
						return location.hash = 'History';
					}
				}
				location.hash = div.id;
			}
		})
	},
	topLayerSetTransparent(){
		this.topLayer.style.background = 'none';
	},
	topLayerSetBackground(){
		this.topLayer.style.background = 'rgb(245 245 249)';
	},
	openMoreMenuInit(){
		this.moremenu.onclick = ()=>{
			this.hideAndShow();
			this.topLayerSetTransparent();
			this.openMoreMenu();
		}
		this.cart.onclick = ()=>{
			// this.hideAndShow();
			// this.topLayerSetBackground();
			// this.openCart();
			location.hash = 'Cart';
		}
	},
	openMoreMenu(){
		this.topLayer.replaceChild(view.moreMenu());
	},
	openCart(){
		if(!this.isLogin){
			app.showWarnings('Mohon login terlebih dahulu!');
			return this.openLogin();
		}
		this.topLayer.replaceChild(view.cart());
	},
	openLupaPass(){
		this.hideAndShow();
		this.topLayerSetBackground();
		this.topLayer.replaceChild(view.lupaPassPage());
	},
	openPriceList(){
		this.topLayer.replaceChild(view.priceListPage());
	},
	openProfile(){
		if(app.isLogin)
			return this.topLayer.replaceChild(view.profilePage());
		this.openLogin();
	},
	generateTools(){
		this.toolsparent.addChild(view.homeTools());
	},
	openTopup(){
		this.topLayer.replaceChild(view.topupPage());
	},
	openTransfer(){
		this.topLayer.replaceChild(view.transferPage());
	},
	initSearchInput(){
		this.finderInput.onclick = ()=>{
			location.hash = 'Search';
		}
	},
	openSearchPage(){
		this.topLayer.replaceChild(view.searchPage());
	},
	saveLoginData(param){
		// adding time valid login
		// valid 10 minute for reload
		param.valid = new Date().getTime() + 600000;
		if(!param.cart)
			param.cart = {};
		// save the login data to ls
		localStorage.setItem('logdata',jsonstr(param));
		this.isLogin = param;
	},
	updateLoginSavedData(){
		localStorage.setItem('logdata',jsonstr(this.isLogin));
	},
	isLoginValid(){
		const logdata = JSON.parse(localStorage.getItem('logdata'));
		if(!logdata || logdata.valid <= new Date().getTime()){
			return {valid:false};
		}
		if(new Date().getTime() >= logdata.valid / 2){
			// updating the valid value
			logdata.valid += 600000;
		}
		return {valid:true,logdata};
	},
	getLogData(){
		const result = this.isLoginValid();
		if(result.valid){
			this.isLogin = result.logdata;
		}
	},
	updateCartData(){
		if(!this.isLogin || !this.isLogin.cart)
			return this.cart.find('#num').innerText = 0;
		this.cart.find('#num').innerText = objlen(this.isLogin.cart);
	},
	showCoDetails(param){
		this.hideAndShow();
		this.topLayerSetBackground();
		this.topLayer.replaceChild(view.coDetails(param));
	},
	hashNavMeta:{
		'':'openHome',
		'#Home':'openHome',
		'#Regis':'openRegis',
		'#Login':'openLogin',
		'#Cart':'openCart',
		'#Profile':'openProfile',
		'#Cekpesanan':'openCekpesanan',
		'#History':'openHistory',
		'#PriceList':'openPriceList',
		'#Emoney':'openEmoney',
		'#PLN':'openPLN',
		'#Games':'openGames',
		'#Pulsa':'openPulsa',
		'#Data':'openData',
		'#Details':'openProductDetails',
		'#Lupapassword':'openLupaPass',
		'#Topup':'openTopup',
		'#Codetails':'showCoDetails',
		'#Detailspayment':'openShowPaymentDetails',
		'#Etalase':'showEtalase',
		'#Search':'openSearchPage'
	},
	navigationInitiator(global){
		window.onhashchange = ()=>{
			if(location.hash === '#Refresh')
				return history.back();
			this.hideAndShow();
			this.topLayerSetBackground();
			this[this.hashNavMeta[location.hash]]();
		}
	},
	openEtalase(param){
		const hash = location.hash === '#Etalase' ? 'Refresh' : 'Etalase';
		this.etalaseState = param;
		location.hash = hash;
	},
	showEtalase(){
		this.topLayer.replaceChild(view.productEtalase(this.etalaseState));
	}
}

app.init();
