const view = {
	initLoading(){
		return makeElement('div',{
			id:'initLoading',
			style:`
				background:#f5f5f5eb;
				position:fixed;
				display:flex;justify-content:center;
				align-items:center; 
				top:0;left:0;width:100%;height:100%;z-index:20;
				flex-direction:column;
				gap:20px;
			`,
			innerHTML:`
				<div style=opacity:.1;>
					<img src=./more/media/initloading.gif>
				</div>
				<div style="
					font-weight:bold;color:gray;
				">Mohon Tunggu...</div>
			`
		})
	},
	productDetails(param){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				background:#f5f5f9;
				display:flex;
				flex-direction:column;
				overflow:hidden;
			`,
			innerHTML:`
				<div style="
					padding:10px;
					height:48px;
					display:flex;
					align-items:center;
					justify-content:center;
					position:relative;
				">
					<div style="
						position: absolute;
				    left: 10px;
				    padding: 10px;
				    width: 32px;
				    height: 32px;
				    cursor:pointer;
					" id=backbutton>
						<img src=./more/media/back.png>
					</div>
					<div class=bold>Detail Produk</div>
				</div>
				<div style="
					height:100%;
					overflow:auto;
					padding:10px;
				">
					<div style="
						margin-bottom: 10px;
				    padding: 5px;
				    background: white;
				    border-radius:5px;
					" class="card">
						<div style="
							width:100%;height:200px;
						">
							<img src="${param.details.bannerUrl}" style="width:100%;height:100%;border-radius:5px;">
						</div>
					</div>
					<div style="
						padding:20px;
						background:white;
						margin-bottom:10px;
						border-radius:5px;
					" class=card>
						<div style="padding-bottom:10px;margin-bottom:10px;font-weight:bold;">${param.title}</div>
						<div>Menyediakan ${param.title} beragam varian dengan harga yang sangat terjangkau.</div>
					</div>
					<div style="
						padding:20px;
						background:white;
						margin-bottom:10px;
						border-radius:5px;
					" class=card>
						<div style="padding-bottom:10px;margin-bottom:20px;font-weight:bold;">Detail Kustomer</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>${param.products[0].category !== 'Games' ? 'Hp Tujuan' : 'User Id / Zone'}</div>
							<div style=display:flex;gap:10px;><input placeholder="${param.products[0].category !== 'Games' ? '08xxxxxxxxx' : 'user id/zone id'}" id=goalNumber type=number class=formc>
								<div style="
							    display: ${param.products[0].category !== 'Games' ? 'none' : 'flex'};
							    font-size:11px;
								" id=useridchecker class=goldbutton>Cek UserID</div>
								<div style="
							    display: ${param.products[0].category === 'Games' ? 'none' : 'flex'};
							    font-size:11px;
								" id=findNumber class=goldbutton>Cari Nomor</div>
							</div>
							${param.products[0].category === 'Games' ? '<div style="margin-top:10px;background-color: #d7f5fc;padding:10px;border-radius:8px;border-color: #b3edf9;color: #03c3ec;"><span style="font-size:12px;">Jika games memiliki zona id, maka gunakan formula berikut:<br>"user id/zona id"</span></div>' : ''}
						</div>
						<div>
							<div style=margin-bottom:10px;>Notifikasi Whatsapp</div>
							<div style=display:flex;><input placeholder=08xxxxxxxxx id=waNotif type=number class=formc></div>
						</div>
					</div>
					<div style="
						padding:20px;
						background:white;
						margin-bottom:10px;
						border-radius:5px;
					" class=card>
						<div style="padding-bottom:10px;margin-bottom:10px;font-weight:bold;">Varian Produk</div>
						<div id=productvarians>
							
						</div>
					</div>
					<div style="
						padding:20px;
						background:white;
						margin-bottom:10px;
						border-radius:5px;
					" class=card>
						<div style="padding-bottom:10px;margin-bottom:10px;font-weight:bold;">Metode Pembayaran</div>
						<div id=payments>
							<div style=margin-top:10px;font-size:12px;color:gray;font-weight:bold;>Memuat metode pembayaran...</div>
						</div>
					</div>
					<div style="
						padding:20px;
						background:white;
						margin-bottom:10px;
						border-radius:5px;
					" class=card>
						<div style="padding-bottom:10px;margin-bottom:10px;font-weight:bold;">Gunakan Voucher</div>
						<div style=display:flex;gap:10px;>
							<div style=display:flex;width:100%;>
								<input placeholder="Masukan kode voucher anda" id=voucher type=number class=formc>
							</div>
							<div class=goldbutton id=checkvoucherstatus style=font-size:11px;>
								Cek Voucher	
							</div>
						</div>
					</div>
					<div style="margin:20px 0;" class=smallimportan>*Dengan melanjutkan berarti anda setuju dengan semua persyaratan kami.</div>
					<div class=goldbutton style=margin-bottom:100px;border-radius:5px; id=buybutton>Proses Pembelian</div>
				</div>
			`,
			close(){
				app.topLayer.hide();
				app.body.style.overflow = 'auto';
				this.remove();
			},
			async forceUserIdChecker(){
				let userInputs = this.find('#goalNumber').value.split('/');
				if(userInputs.length === 1 && !userInputs[0].length)
					return app.showWarnings('Cek kembali data anda!');
				const games = param.products[0].brand.toLowerCase();
				let userdata;
				if(games === 'free fire'){
					userdata = `free-fire?id=${userInputs[0]}`;
				}else if(games === 'mobile legends'){
					userdata = `mobile-legends?id=${userInputs[0]}&zone=${userInputs[1]}`;
				}
				const result = await new Promise((resolve,reject)=>{
					cOn.get({
						url:`${app.usernameCheckerUrl}/${userdata}`,
						onload(){
							resolve(this.getJSONResponse());
						}
					})
				})
				if(result.status){
					this.data.gamesData = result;
					return app.showWarnings(`${result.message} <br>${result.data.username} (${result.data.user_id})`);
				}
				app.showWarnings('ID tidak ditemukan');
			},
			async checkVoucher(){
				const voucherValue = this.find('#voucher').value;
				if(!voucherValue.length && !isNaN(voucherValue))
					return app.showWarnings('Data voucher tidak valid!');
				const response = await new Promise((resolve,reject)=>{
					cOn.get({
						url:`${app.baseUrl}/voucherstatus?code=${voucherValue}&&category=${param.products[0].category.toLowerCase()}&&brand=${param.products[0].brand.toLowerCase()}&&sku=${this.data.productVarian}`,
						onload(){
							resolve(this.getJSONResponse());
						}
					})
				})
				app.showWarnings(response.message);
			},
			async openContact(){
				if('contacts' in navigator && 'select' in navigator.contacts){
					let contacts = await navigator.contacts.select(['name','tel'],{multiple:false});
					let number = contacts[0].tel[0];
					if(!number)
						return app.showWarnings('Data kontak tidak valid!');
					number = number.replaceAll('-','');
					number = number.replaceAll('+62 8','08');
					number = number.replaceAll('+628','08');
					number = number.replaceAll('62 8','08');
					number = number.replaceAll('628','08');
					this.find('#goalNumber').value = number;
				}else app.showWarnings('Fitur tidak disupport pada perangkat ini!');
			},
			onadded(){
				this.data.brand = param.products[0].brand.toLowerCase();
				this.data.category = param.products[0].category.toLowerCase();
				this.find('#backbutton').onclick = ()=>{
					this.close();
				}
				this.find('#buybutton').onclick = ()=>{
					this.collectData();
				}
				this.find('#useridchecker').onclick = ()=>{
					this.forceUserIdChecker();
				}
				this.find('#checkvoucherstatus').onclick = ()=>{
					this.checkVoucher();
				}
				this.find('#findNumber').onclick = ()=>{
					this.openContact();
				}
				this.payments = this.find('#payments');
				this.variansdiv = this.find('#productvarians');
				this.anim({
					targets:this,
					height:['0','100%'],
					duration:1000
				})
				this.generateVarians();
				this.generatePaymentMethod(0);
			},
			data:{
				productVarian:null,
				paymentMethod:null,
				waNotif:null,
				goalNumber:null,
				varianName:null,
				methodName:null,
				price:null,
				voucher:null
			},
			collectData(){
				this.findall('input').forEach(input=>{
					if(input.value.length > 0){
						this.data[input.id] = input.value;
					}
				})
				let valid = true;
				for(let i in this.data){
					if(!this.data[i] && i !== 'voucher')
						valid = false;
				}
				if(!valid)
					return app.showWarnings('Mohon periksa kembali data anda!');
				app.confirmAction(this.data);
			},
			generateVarians(){
				param.products.sort((a,b)=>{return a.price - b.price});
				let activeVarian;
				param.products.forEach(item=>{
					let title = item.product_name.toLowerCase();
					title = title[0].toUpperCase() + title.slice(1);
					this.variansdiv.addChild(makeElement('div',{
						parent:this,
						className:'card',
						style:`
							height:64px;
							border-radius:5px;
							display:flex;
							justify-content:space-between;
							align-items:center;
							padding:10px 20px;
							cursor:pointer;
							margin-top:15px;
							flex-wrap:wrap;
							gap:10px;
						`,
						innerHTML:`
							<div>${title}</div>
							<div>Rp ${getPrice(item.price)}</div>
						`,
						onclick(){
							if(activeVarian)
								activeVarian.classList.remove('varianselected');
							this.classList.add('varianselected');
							activeVarian = this;
							this.parent.data.productVarian = item.buyer_sku_code;
							this.parent.data.varianName = title;
							this.parent.data.price = item.price;
							this.parent.generatePaymentMethod(item.price);
						}
					}))
				})
			},
			generateSaldoGuaranteeMethod(price,activeVarian){
				this.payments.addChild(makeElement('div',{
					parent:this,
					className:'card',
					style:`
						border-radius:5px;
						display:flex;
						padding:20px;
						cursor:pointer;
						margin-top:15px;
						gap:15px;
						align-items:center;
						flex-wrap:wrap;
					`,
					innerHTML:`
						<div><img src="./more/media/guaranteeicon.png" style="background:white;object-fit:contain;border-radius:5px;padding:10px;"></div>
						<div style=display:flex;gap:10px;flex-direction:column;>
							<div style=font-size:14px;>
								<div>Saldo Garansi</div>
								<div id=saldolabel style="font-size:10px;">-</div>
							</div>
							<div style=font-size:12px;>Rp ${getPrice(Number(price))}</div>
						</div>
					`,
					async onadded(){
						this.saldovalue = await new Promise((resolve,reject)=>{
							cOn.get({
								url:`${app.baseUrl}/guaranteesaldo?saldoId=${localStorage.getItem('saldoId')}`,
								onload(){
									resolve(this.getJSONResponse());
								}
							})
						});
						if(this.saldovalue.valid)
							this.find('#saldolabel').innerText = `Anda memiliki Rp. ${getPrice(this.saldovalue.price)} saldo garansi.`;
						else this.find('#saldolabel').innerText = 'Anda tidak memiliki saldo garansi.';
					},
					onclick(){
						if(!this.saldovalue)
							return app.showWarnings('Mohon tunggu sebentar sedang memproses data anda!');
						if(!this.saldovalue.valid)
							return app.showWarnings('Anda tidak memiliki saldo garansi');
						if(this.saldovalue.price < price)
							return app.showWarnings('Saldo garansi tidak mencukupi!');
						if(this.parent.data.productVarian){
							if(activeVarian)
								activeVarian.classList.remove('varianselected');
							this.classList.add('varianselected');
							activeVarian = this;
							this.parent.data.paymentMethod = 'gs';
							this.parent.data.methodName = 'Saldo Garansi';
							this.parent.data.saldoId = localStorage.getItem('saldoId');
						}else app.showWarnings('Silahkan memilih produk terlebih dahulu!');
					}
				}))
			},
			async generatePaymentMethod(price){
				const availMethods = await new Promise((resolve,reject)=>{
					cOn.get({url:`${app.baseUrl}/getpayment?price=${price}`,onload(){
						const results = this.getJSONResponse();
						console.log(results);
						if(results.ok)
							return resolve(results.results.paymentFee);
						resolve(false);
					}})
				})
				this.payments.clear();
				let activeVarian;
				this.generateSaldoGuaranteeMethod(price,activeVarian);
				if(availMethods){
					availMethods.forEach(method=>{
						this.payments.addChild(makeElement('div',{
							parent:this,
							className:'card',
							style:`
								border-radius:5px;
								display:flex;
								padding:20px;
								cursor:pointer;
								margin-top:15px;
								gap:15px;
								align-items:center;
								flex-wrap:wrap;
							`,
							innerHTML:`
								<div><img src="${method.paymentImage}" style="background:white;width:54px;height:54px;object-fit:contain;border-radius:5px;"></div>
								<div style=display:flex;gap:10px;flex-direction:column;>
									<div style=font-size:14px;>${method.paymentName}</div>
									<div style=font-size:12px;>Rp ${getPrice(Number(method.totalFee) + price)}</div>
								</div>
							`,
							onclick(){
								if(this.parent.data.productVarian){
									if(activeVarian)
										activeVarian.classList.remove('varianselected');
									this.classList.add('varianselected');
									activeVarian = this;
									this.parent.data.paymentMethod = method.paymentMethod;
									this.parent.data.methodName = method.paymentName;
								}else app.showWarnings('Silahkan memilih produk terlebih dahulu!');
							}
						}))
					})
				}
			}
		})
	},
	confirmAction(param){
		return makeElement('div',{
			style:`
				position: fixed;
			  top:0;
			  left:0;
			  width: 100%;
			  height: 100%;
			  display: flex;
			  align-items: flex-start;
			  justify-content: center;
			  z-index: 14;
			  background: rgb(225 225 225 / 47%);
			`,
			innerHTML:`
				<div id=loadingConfirm style="
					height:100%;
					width:100%;
					display:none;
					justify-content:center;
					color:gray;
					font-size:12px;
					font-weight:bold;
					align-items:flex-start;
				">
					<div style=margin-top:20px;>Mohon tunggu, sedang memproses permintaan anda!</div>
				</div>
				<div style="
					background:white;
					border-radius:5px;
					margin-top:20px;
					display:flex;
					flex-direction:column;
					position:absolute;
					top:0;
				" class="smartWidth card" id=box>
					<div style="
						padding:20px;
						border-bottom:1px solid gainsboro;
						display:flex;
						align-items:center;
						justify-content:center;
						position:relative;
						border-radius:10px 10px 0 0;
					">
						<div style="
							position:absolute;
							left:20px;cursor:pointer;
						" id=backbutton>
							<img src=./more/media/back.png>
						</div>
						<div>Konfirmasi Pesanan</div>
					</div>
					<div style="
						padding:20px;
						overflow:auto;
						height:100%;
					">
						<div style=margin-bottom:15px;>
							<div style=margin-bottom:10px;>Hp Tujuan</div>
							<div style=display:flex;>
								<input value="${param.goalNumber}" class=formc>
							</div>
						</div>
						<div style=margin-bottom:15px;>
							<div style=margin-bottom:10px;>Notifikasi Whatsapp</div>
							<div style=display:flex;>
								<input value="${param.waNotif}" class=formc>
							</div>
						</div>
						<div style=margin-bottom:15px;>
							<div style=margin-bottom:10px;>Varian Produk</div>
							<div style=display:flex;>
								<input value="${param.varianName}" class=formc>
							</div>
						</div>
						<div style=margin-bottom:15px;>
							<div style=margin-bottom:10px;>Harga Produk</div>
							<div style=display:flex;>
								<input value="Rp ${getPrice(param.price)}" class=formc>
							</div>
						</div>
						<div>
							<div style=margin-bottom:10px;>Metode Pembayaran</div>
							<div style=display:flex;>
								<input value="${param.methodName}" class=formc>
							</div>
						</div>
					</div>
					<div style="padding:0 10px;">
						<div class=goldbutton style=margin-bottom:10px; id=confirmbutton>Konfirmasi & Lanjutkan</div>
					</div>
				</div>
			`,
			async doConfirm(){
				console.log(param);
				this.box.remove();
				this.loadingConfirm.show('flex');
				const results = JSON.parse(await new Promise((resolve,reject)=>{
					cOn.post({
						url:`${app.baseUrl}/dopayment`,
						someSettings:[['setRequestHeader','Content-type','application/json']],
						data:jsonstr(param),
						onload(){
							resolve(this.responseText);
						}
					})
				}))
				console.log(results);
				if(!results.ok){
					app.showWarnings(results.message);
					this.remove();
				}else{
					app.openPaymentDetails({payments:results.data,products:param},true);
					this.remove();	
				}
			},
			onadded(){
				console.log(param);
				this.loadingConfirm = this.find('#loadingConfirm');
				this.box = this.find('#box');
				this.find('#backbutton').onclick = ()=>{
					this.remove();
				}
				this.find('#confirmbutton').onclick = ()=>{
					this.doConfirm();
				}
				this.anim({
					targets:this.box,
					duration:1000,
					height:['0','400px']
				})
			}
		})
	},
	paymentDetails(param,param2){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				background:#f5f5f9;
				display:flex;
				flex-direction:column;
				overflow:hidden;
				border-radius:10px 10px 0 0;
			`,
			innerHTML:`
				<div style="
					padding:10px;
					height:48px;
					display:flex;
					align-items:center;
					justify-content:center;
					position:relative;
				">
					<div style="
						position: absolute;
				    left: 10px;
				    padding: 10px;
				    width: 32px;
				    height: 32px;
				    cursor:pointer;
					" id=backbutton>
						<img src=./more/media/back.png>
					</div>
					<div class=bold>Detail Pesanan</div>
					<div style="
						position: absolute;
				    right: 10px;
				    padding: 5px;
				    width: 32px;
				    height: 32px;
				    cursor:pointer;
				    display: flex;
				    align-items: center;
				    justify-content: center;
				    border-radius:5px;
					" id=refreshbutton class=goldbutton>
						<img src=./more/media/refreshicon.png style=width:24px;height:24px;>
					</div>
				</div>
				<div style="
					height:100%;
					overflow:auto;
					padding:10px;
				">
					<div style="
						padding:20px;
						background:white;
						margin-bottom:10px;
						border-radius:5px;
					" class=card>
						<div style="padding-bottom:10px;margin-bottom:10px;font-weight:bold;">Pesanan berhasil dibuat!</div>
						<div>Terimakasih telah melakukan pemesanan, mohon hubungi admin jika ada kebingungan</div>
					</div>
					<div style="
						padding:20px;
						background:white;
						margin-bottom:10px;
						border-radius:5px;
					" class=card>
						<div style="padding-bottom:10px;margin-bottom:20px;font-weight:bold;">Detail Pesanan</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>Order Id</div>
							<div style=display:flex;><input placeholder=08-xxx-xxx-xxx value="${param.payments.orderId}"></div>
						</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>Hp Tujuan</div>
							<div style=display:flex;><input placeholder=08-xxx-xxx-xxx value="${param.products.goalNumber}"></div>
						</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>Notifikasi Whatsapp</div>
							<div style=display:flex;><input placeholder=08-xxx-xxx-xxx value="${param.products.waNotif}"></div>
						</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>Produk</div>
							<div style=display:flex;><input value="${param.products.varianName}"></div>
						</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>Harga</div>
							<div style=display:flex;><input value="Rp ${getPrice(param.products.price)}"></div>
						</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>Status</div>
							<div style=display:flex;><input value="${param.payments.status === 'Pending' ? 'Menunggu Pembayaran' : param.products.status === 'Processing' ? 'Sedang di proses' : param.products.status === 'Success' ? 'Berhasil' : 'Gagal'}"></div>
						</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>Waktu Pemesanan</div>
							<div style=display:flex;><input value="${param.payments.dateCreate}"></div>
						</div>
						<div>
							<div style=margin-bottom:10px;>Klaim Garansi</div>
							<div style="
								padding: 20px;
						    color:  ${param.payments.status === 'Pending' ? 'black' : param.products.status === 'Processing' ? 'black' : param.products.status === 'Success' ? 'white' : 'black'};
						    border-radius:5px;
						    border:1px solid gainsboro;
						    background: ${param.payments.status === 'Pending' ? 'whitesmoke' : param.products.status === 'Processing' ? 'whitesmoke' : param.products.status === 'Success' ? '#8973df' : 'whitesmoke'};
						    text-align: center;
						    cursor: ${param.payments.status === 'Pending' ? 'not-allowed' : param.products.status === 'Processing' ? 'not-allowed' : param.products.status === 'Success' ? 'pointer' : 'not-allowed'};
							" id=guaranteebutton>${param.payments.status === 'Pending' ? 'Tidak Tersedia' : param.products.status === 'Processing' ? 'Tidak Tersedia' : param.products.status === 'Success' ? 'Klaim' : 'Tidak Tersedia'}</div>
						</div>
					</div>
					<div style="
						padding:20px;
						background:white;
						margin-bottom:10px;
						border-radius:5px;
					" class=card>
						<div style="padding-bottom:10px;margin-bottom:20px;font-weight:bold;">Detail Pembayaran</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>Metode Pembayaran</div>
							<div style=display:flex;><input value="${param.products.methodName}"></div>
						</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>Status</div>
							<div style=display:flex;><input value="${Date.parse(param.payments.dateCreate) + 600000 < Date.parse(new Date().toLocaleString('en-US',{ timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })) ? 'Kadaluwarsa' : param.payments.status === 'Pending' ? 'Belum dibayar' : 'Dibayar'}"></div>
						</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>QR / VA</div>
							<div style=display:${param.payments.vaNumber ? 'flex' : 'none'};gap:10px;>
								<input value="${param.payments.vaNumber}" id=vanumberinput>
								<div style="
							    display: flex;
							    align-items: center;
							    width: 32px;
							    height: 32px;
							    padding: 5px;
							    border-radius:5px;
							    cursor:pointer;
								" class=goldbutton>
									<img src=./more/media/copyicon.png id=vacopybutton>
								</div>
							</div>
							<div style="text-align:center;display:${param.payments.qrString ? 'block' : 'none'};
								    padding: 20px;
								    border: 1px solid gainsboro;
								    border-radius:5px;
								    position:relative;
								    overflow:hidden;
							">
								<img style="width:100%;height:100%;object-fit:cover;" src=" https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${param.payments.qrString}">
								<div style="
									position: absolute;
							    top: 0;
							    left: 0;
							    width: 100%;
							    height: 100%;
							    background: #f5f5f5ed;
							    display: ${Date.parse(param.payments.dateCreate) + 600000 < Date.parse(new Date().toLocaleString('en-US',{ timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })) ? 'flex' : 'none'};
							    align-items: center;
							    justify-content: center;
							    font-weight: bold;
								">Waktu Pembayaran Telah Berakhir!</div>
							</div>
							<div ${!param.payments.qrString && !param.payments.vaNumber ? '' : 'hidden'} style="
							    background: #118eea;
							    color: white;
							    border-radius:5px;
							    padding: 20px;
							    text-align: center;
							    cursor:pointer;
							" id=openeksternalpayment>${param.payments.status === 'Success' ? 'Telah dibayar' : param.payments.status === 'Canceled' ? 'Gagal' : param.products.methodName === 'DANA' ? 'Buka DANA' : 'Bayar Sekarang'}</div>
						</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>Waktu Kadaluwarsa</div>
							<div style=display:flex;><input value="10 Menit"></div>
						</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>Tanggal Kadaluwarsa</div>
							<div style=display:flex;><input value="${new Date(Date.parse(param.payments.dateCreate) + 600000).toLocaleString()}"></div>
						</div>
						<div>
							<div style=margin-bottom:10px;>Instruksi Pembayaran</div>
							<div style=display:flex;><input value="${!param.payments.vaNumber && !param.payments.qrString ? 'Klik tombol bayar diatas' : param.payments.vaNumber ? 'Salin kode VA diatas' : 'Scan Qr diatas!'}"></div>
						</div>
					</div>
					<div style="
						padding:20px;
						background:white;
						margin-bottom:100px;
						border-radius:5px;
					" class=card>
						<div id=givefeedback class=goldbutton>
							<img src=./more/media/feedbackicon.png>
							<div>Berikan Masukan</div>
						</div>
					</div>
				</div>
			`,
			close(){
				app.topLayer.hide();
				app.body.style.overflow = 'auto';
				this.remove();
			},
			onadded(){
				if(param2)
					app.pushNewTransactionData(param);
				this.find('#backbutton').onclick = ()=>{
					app.openHistory();
				}
				this.find('#vacopybutton').onclick = ()=>{
					navigator.clipboard.writeText(this.find('#vanumberinput').value);
					app.showWarnings('Nomor VA berhasil disalin!');
				}
				this.find('#givefeedback').onclick = ()=>{
					app.openFeedBackSender(param.payments.orderId);
				}
				this.find('#guaranteebutton').onclick = ()=>{
					//add some logic to this.
					if(param.payments.status === 'Success' && param.products.status && param.products.status !== 'Sukses')
						app.openGuaranteeType(param);
					else app.showWarnings('Garansi tidak tersedia!');
					app.openGuaranteeType(param);
				}
				this.find('#refreshbutton').onclick = async ()=>{
					const response = await new Promise((resolve,reject)=>{
						cOn.get({
							url:`${app.baseUrl}/orderdetails?orderId=${param.payments.orderId}`,
							onload(){
								resolve(this.getJSONResponse());
							}
						})
					})
					if(!response.valid)
						return app.showWarnings('Maaf, mohon periksa kembali data orderId anda!');
					app.openPaymentDetails(response.data);
				}
				this.find('#openeksternalpayment').onclick = ()=>{
					const expiredStamp = Date.parse(param.payments.dateCreate) + 600000;
					const timeNow = Date.parse(new Date().toLocaleString('en-US',{ timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }));
					if(timeNow > expiredStamp)
						return app.showWarnings('Maaf, waktu pembayaran telah berakhir / kadaluwarsa!');
					window.open(param.payments.paymentUrl);
				}
				this.anim({
					targets:this,
					height:['0','100%'],
					duration:1000
				})
			}
		})
	},
	transactionHistories(){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				background:#f5f5f9;
				display:flex;
				flex-direction:column;
				overflow:hidden;
				border-radius:10px 10px 0 0;
			`,
			innerHTML:`
				<div style="
					padding:10px;
					height:48px;
					display:flex;
					align-items:center;
					justify-content:center;
					position:relative;
				">
					<div style="
						position: absolute;
				    left: 10px;
				    padding: 10px;
				    width: 32px;
				    height: 32px;
				    cursor:pointer;
					" id=backbutton>
						<img src=./more/media/back.png>
					</div>
					<div class=bold>Histori Transaksi</div>
					<div style="
						position: absolute;
				    right: 10px;
				    padding: 10px;
				    width: 24px;
				    height: 24px;
				    cursor:pointer;
					" id=opensettingsbutton>
						<img src=./more/media/settings.png style=width:100%;height:24px;>
					</div>
				</div>
				<div id=menu style="
					border:0;
					border-radius:0;
					padding:10px;
					width:auto;
					border-bottom:1px solid gainsboro;
					height:54px;
				">
	        <div id=Pulsa>Pulsa</div>
	        <div id=Data>Data</div>
	        <div id=Games>Games</div>
	        <div id=PLN>Pln</div>
        	<div id=Emoney>E-money</div>
	      </div>
				<div style="
					height:100%;
					overflow:auto;
					padding:10px;
					padding-bottom:100px;
				" id=itemsparent>
				<div>
						<div style="
							padding:20px;
							background:white;
							border-radius:5px;
							margin-bottom:10px;
							display: flex;
					    justify-content: space-between;
					    align-items: center;
						" class=card>
							<div>
								<div style=margin-bottom:10px;font-weight:bold;>Saldo Garansi</div>
								<div style=display:flex;gap:10px; id=saldoguarantee>
									Rp. 0
								</div>
							</div>
							<div id=updatemysaldo class=goldbutton>
								<img src=./more/media/refreshicon.png style=width:16px;>
							</div>
						</div>
						<div style="margin:10px 10px;font-weight:9px;color:gray;text-decoration:underline;cursor:pointer;" id=reset>Reset SaldoId</div>
					</div>
					<div>
						<div style="
							padding:20px;
							background:white;
							border-radius:5px;
							margin-bottom:10px;
						" class=card>
							<div style=margin-bottom:10px;font-weight:bold;>Cek Pesanan</div>
							<div style=display:flex;gap:10px;>
								<div style=display:flex;width:100%;>
									<input placeholder="Masukan / Paste orderId anda!" id=pasteid>
								</div>
								<div id=forceCheckingButton class=goldbutton style=font-size:11px;>Cek Pesanan</div>
							</div>
						</div>
					</div>
				</div>
			`,
			close(){
				app.topLayer.hide();
				app.body.style.overflow = 'auto';
				this.remove();
			},
			handleNav(){
				this.findall('#menu div').forEach(btn=>{
					btn.onclick = ()=>{
						app[`open${btn.id}`]();
					}
				})
			},
			updatemysaldo(){
				/*
					getting saved saldo id.
					! get saldo id.

				*/
				const saldoId = localStorage.getItem('saldoId');
				if(!saldoId){
					app.showWarnings('SaldoId tidak ditemukan!')
					return app.getSaldoId();
				}
				app.openHistory();
			},
			async onadded(){
				//loading the data.
				this.pasteid = this.find('#pasteid');
				this.itemsparent = this.find('#itemsparent');
				this.saldo = this.find('#saldoguarantee');
				this.trxData = (JSON.parse(localStorage.getItem('easypulsatransactionhistories'))||[]).sort((a,b)=>{
					return Date.parse(b.payments.dateCreate) - Date.parse(a.payments.dateCreate);
				});
				this.find('#backbutton').onclick = ()=>{
					this.close();
				}
				this.find('#opensettingsbutton').onclick = ()=>{
					app.openTransactionHistoriesSettings();
				}
				this.find('#updatemysaldo').onclick = ()=>{
					this.updatemysaldo();
				}
				this.find('#reset').onclick = ()=>{
					app.getSaldoId();
				}
				this.find('#forceCheckingButton').onclick = async ()=>{
					if(!this.pasteid.value.length)
						return app.showWarnings('Maaf, mohon periksa kembali data orderId anda!');
					const response = await new Promise((resolve,reject)=>{
						cOn.get({
							url:`${app.baseUrl}/orderdetails?orderId=${this.pasteid.value}`,
							onload(){
								console.log('databack');
								resolve(this.getJSONResponse());
							}
						})
					})
					if(!response.valid)
						return app.showWarnings('Maaf, mohon periksa kembali data orderId anda!');
					app.openPaymentDetails(response.data);
				}
				await this.showsaldo();
				this.handleNav();
				this.anim({
					targets:this,
					height:['0','100%'],
					duration:1000
				})
				this.generateHistoriesItem();
			},
			showsaldo(){
				return new Promise((resolve,reject)=>{
					const saldo = this.saldo;
					const saldoId = localStorage.getItem('saldoId');
					if(!saldoId){
						saldo.innerText = 'Rp. 0';
						resolve();
					}
					cOn.get({
						url:`${app.baseUrl}/guaranteesaldo?saldoId=${saldoId}`,
						onload(){
							const response = this.getJSONResponse();
							if(!response.valid){
								saldo.innerText = 'Rp. 0';
							}else{
								saldo.innerText = `Rp. ${getPrice(response.price)}`;
							}
							resolve();
						}
					})
				})
			},
			generateHistoriesItem(){
				this.trxData.forEach( data => {
					console.log(data);
					this.itemsparent.addChild(makeElement('div',{
						innerHTML:`
							<div style="
								padding:20px;
								background:white;
								border-radius:10px 10px 0 0;
							" class=card>
								<div style="
									font-size:12px;
									margin-bottom:15px;
								">OrderId: ${data.payments.orderId}</div>
								<div style="
									padding-bottom:10px;
									margin-bottom:20px;
									border-bottom:1px solid gainsboro;
									display:flex;
									justify-content:space-between;
									flex-wrap:wrap;
									gap:15px;
								">
									<div>${data.products.varianName}</div>
									<div>Rp ${getPrice(data.products.price)}</div>
								</div>
								<div style="
									padding-bottom:10px;
									font-size:12px;
									display:flex;
									flex-direction:column;
									gap:10px;
									color:gray;
								">
									<div style=display:flex;justify-content:space-between;>
										<div>Tanggal</div>
										<div>${data.payments.dateCreate}</div>
									</div>
									<div style=display:flex;justify-content:space-between;>
										<div>Nomor Tujuan / User Id</div>
										<div>${data.products.goalNumber}</div>
									</div>
									<div style=display:flex;justify-content:space-between;>
										<div>Metode Pembayaran</div>
										<div>${data.products.methodName}</div>
									</div>
									<div style=display:flex;justify-content:space-between;>
										<div>Status</div>
										<div>${data.payments.status === 'Pending' ? 'Menunggu Pembayaran' : data.products.status}</div>
									</div>
								</div>
								
							</div>
							<div class=goldbutton style="
								border:none;
								border-radius:0 0 10px 10px;
								margin-bottom:10px;
							" id=checkorderbutton>Cek Pesanan</div>
						`,
						async checkOrder(){
							const response = await new Promise((resolve,reject)=>{
								cOn.get({
									url:`${app.baseUrl}/orderdetails?orderId=${data.payments.orderId}`,
									onload(){
										console.log('databack');
										resolve(this.getJSONResponse());
									}
								})
							})
							if(!response.valid)
								return app.showWarnings('Maaf, tidak dapat memuat data order anda!');
							app.openPaymentDetails(response.data);
						},
						onadded(){
							this.find('#checkorderbutton').onclick = ()=>{
								this.checkOrder();
							}
						}
					}))
				})
				if(!this.trxData.length)
					this.itemsparent.addChild(makeElement('div',{
						innerHTML:`
							Tidak ada history pemesanan...
						`,
						style:`
							text-align: center;
					    font-size: 12px;
					    color: gray;
					    margin-top: 100px;
						`
					}))
			}
		})
	},
	transactionSettings(){
		return makeElement('div',{
			style:`
				position: fixed;
			  top:0;
			  left:0;
			  width: 100%;
			  height: 100%;
			  display: flex;
			  align-items: flex-start;
			  justify-content: center;
			  z-index:14;
			  background: rgb(225 225 225 / 47%);
			`,
			innerHTML:`
				<div style="
					background:white;
					border:1px solid gainsboro;
					border-radius:5px;
					margin-top:20px;
					display:flex;
					flex-direction:column;
					position:absolute;
					top:0;
				" class=smartWidth id=box>
					<div style="
						padding:20px;
						border-bottom:1px solid gainsboro;
						display:flex;
						align-items:center;
						justify-content:center;
						position:relative;
						border-radius:10px 10px 0 0;
					">
						<div style="
							position:absolute;
							left:20px;cursor:pointer;
						" id=backbutton>
							<img src=./more/media/back.png>
						</div>
						<div>Pengaturan Histori Transaksi</div>
					</div>
					<div style="
						padding:20px;
						overflow:auto;
						height:100%;
					">
						<div style=margin-bottom:15px;>
							<div style=margin-bottom:10px;>Bersihkan Histori</div>
							<div style=display:flex;>
								<div id=clearButton style="
									padding:20px;
									border:1px solid gainsboro;
									border-radius:5px;
									background:#8973df;
									color:white;
									width:100%;
									text-align:center;
									cursor:pointer;
								">Hapus Histori Transaksi</div>
							</div>
						</div>
					</div>
					<div style="padding:0 10px;">
						<div class=goldbutton style=margin-bottom:10px; id=confirmbutton>Simpan Pengaturan</div>
					</div>
				</div>
			`,
			onadded(){
				this.find('#backbutton').onclick = ()=>{
					app.openHistory();
					this.remove();
				}
				this.find('#clearButton').onclick = ()=>{
					app.clearHistory();
				}
				this.anim({
					targets:this.find('#box'),
					height:['0','600px'],
					duration:1000,
					complete:()=>{
						this.find('#box').style.height = 'auto';
					}
				})
			}
		})
	},
	emoneyProducts(){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				background:#f5f5f9;
				display:flex;
				flex-direction:column;
				overflow:hidden;
				border-radius:10px 10px 0 0;
			`,
			innerHTML:`
				<div style="
					padding:10px;
					height:48px;
					display:flex;
					align-items:center;
					justify-content:center;
					position:relative;
				">
					<div style="
						position: absolute;
				    left: 10px;
				    padding: 10px;
				    width: 32px;
				    height: 32px;
				    cursor:pointer;
					" id=backbutton>
						<img src=./more/media/back.png>
					</div>
					<div class=bold>Produk E-Money</div>
				</div>
				<div id=menu style="
					border:0;
					border-radius:0;
					padding:10px;
					width:auto;
					border-bottom:1px solid gainsboro;
					height:54px;
				">
        	<div id=Pulsa>Pulsa</div>
	        <div id=Data>Data</div>
	        <div id=Games>Games</div>
	        <div id=PLN>Pln</div>
	      </div>
				<div style="
					height:100%;
					overflow:auto;
					padding:10px;
				" id=pplace>
				</div>
			`,
			close(){
				app.topLayer.hide();
				app.body.style.overflow = 'auto';
				this.remove();
			},
			handleNav(){
				this.findall('#menu div').forEach(btn=>{
					console.log('called');
					btn.onclick = ()=>{
						app[`open${btn.id}`]();
					}
				})
			},
			onadded(){
				this.find('#backbutton').onclick = ()=>{
					this.close();
				}
				this.pplace = this.find('#pplace');
				this.handleNav();
				this.anim({
					targets:this,
					height:['0','100%'],
					duration:1000
				})
				this.generateProducts();
			},
			generateProducts(){
				const products = [];
				for(let i in app.products['E-Money']){
					products.push(app.products['E-Money'][i]);
				}
				let loopLen = products.length/2;
				if(products.length % 2 !== 0){
					loopLen = (products.length + 1) / 2
				}
				let index = 0;
				for(let i=0;i<loopLen;i++){
					this.pplace.addChild(makeElement('div',{
						style:'display:flex;gap:10px;',
						onadded(){
							for(let j=0;j<3;j++){
								const thumbnail = products[index]?products[index].data[0].thumbnail:null;
								let category = products[index]?products[index].data[0].category.toLowerCase():null;
								let brand = products[index]?products[index].data[0].brand.toLowerCase():null;
								if(thumbnail){
									category = category[0].toUpperCase() + category.slice(1);
									brand = brand[0].toUpperCase() + brand.slice(1);
								}
								this.addChild(makeElement('div',{
									category:products[index]?products[index].data[0].category:null,
									brand:products[index]?products[index].data[0].brand:null,
									style:`width:100%;opacity:${!thumbnail?0:1};cursor:${!thumbnail?'unset':'pointer'};`,
									innerHTML:`
										<div style="
											${i==0 ? 'padding-top:20px;':''}
											border-radius:5px 5px 0 0;
											padding-bottom:10px;
										">
											<div style="
					              width:100%;
					              height:100%;
					              display: flex;
					              justify-content: center;
					            ">
					              <img src="${thumbnail}" style="
					                width:90px;
					                height:90px;
					                object-fit: cover;
					                border-radius:5px;
					                margin-top:15px;
					              ">
					            </div>
										</div>
										<div style="
											border:none;
											border-radius:0 0 5px 5px;
											margin-bottom:10px;cursor:unset;
											border-top:0;
											text-align:center;
										">${' '+brand}</div>
									`,
									onclick(){
										app.openDetailsProduct({
											title:`${category + ' ' +brand}`,
											details:app.products[this.category][this.brand].details,
											products:app.products[this.category][this.brand].data
										});
									}
								}))
								index += 1;
							}
						}
					}))
				}
			}
		})
	},
	pulsaProducts(){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				background:#f5f5f9;
				display:flex;
				flex-direction:column;
				overflow:hidden;
				border-radius:10px 10px 0 0;
			`,
			innerHTML:`
				<div style="
					padding:10px;
					height:48px;
					display:flex;
					align-items:center;
					justify-content:center;
					position:relative;
				">
					<div style="
						position: absolute;
				    left: 10px;
				    padding: 10px;
				    width: 32px;
				    height: 32px;
				    cursor:pointer;
					" id=backbutton>
						<img src=./more/media/back.png>
					</div>
					<div class=bold>Produk Pulsa</div>
				</div>
				<div id=menu style="
					border:0;
					border-radius:0;
					padding:10px;
					width:auto;
					border-bottom:1px solid gainsboro;
					height:54px;
				">
	        <div id=Data>Data</div>
	        <div id=Games>Games</div>
	        <div id=PLN>Pln</div>
        	<div id=Emoney>E-money</div>
	      </div>
				<div style="
					overflow:auto;
					padding:10px;
				" id=pplace>
				</div>
			`,
			close(){
				app.topLayer.hide();
				app.body.style.overflow = 'auto';
				this.remove();
			},
			handleNav(){
				this.findall('#menu div').forEach(btn=>{
					console.log('called');
					btn.onclick = ()=>{
						app[`open${btn.id}`]();
					}
				})
			},
			onadded(){
				this.find('#backbutton').onclick = ()=>{
					this.close();
				}
				this.pplace = this.find('#pplace');
				this.handleNav();
				this.anim({
					targets:this,
					height:['0','100%'],
					duration:1000
				})
				this.generateProducts();
			},
			generateProducts(){
				const products = [];
				for(let i in app.products.Pulsa){
					products.push(app.products.Pulsa[i]);
				}
				let loopLen = products.length/2;
				if(products.length % 2 !== 0){
					loopLen = (products.length + 1) / 2
				}
				let index = 0;
				for(let i=0;i<loopLen;i++){
					this.pplace.addChild(makeElement('div',{
						style:'display:flex;gap:10px;',
						onadded(){
							for(let j=0;j<3;j++){
								const thumbnail = products[index]?products[index].data[0].thumbnail:null;
								let category = products[index]?products[index].data[0].category.toLowerCase():null;
								let brand = products[index]?products[index].data[0].brand.toLowerCase():null;
								if(thumbnail){
									category = category[0].toUpperCase() + category.slice(1);
									brand = brand[0].toUpperCase() + brand.slice(1);
								}
								this.addChild(makeElement('div',{
									category:products[index]?products[index].data[0].category:null,
									brand:products[index]?products[index].data[0].brand:null,
									style:`width:100%;opacity:${!thumbnail?0:1};cursor:${!thumbnail?'unset':'pointer'};`,
									innerHTML:`
										<div style="
											${i==0 ? 'padding-top:20px;':''}
											border-radius:5px 5px 0 0;
											padding-bottom:10px;
										">
											<div style="
					              width:100%;
					              height:100%;
					              display: flex;
					              justify-content: center;
					            ">
					              <img src="${thumbnail}" style="
					                width:90px;
					                height:90px;
					                object-fit: cover;
					                border-radius:5px;
					                margin-top:15px;
					              ">
					            </div>
										</div>
										<div style="
											border:none;
											border-radius:0 0 5px 5px;
											margin-bottom:10px;cursor:unset;
											text-align:center;
										">${category+' '+brand}</div>
									`,
									onclick(){
										app.openDetailsProduct({
											title:`${category + ' ' +brand}`,
											details:app.products[this.category][this.brand].details,
											products:app.products[this.category][this.brand].data
										});
									}
								}))
								index += 1;
							}
						}
					}))
				}
			}
		})
	},
	dataProducts(){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				background:#f5f5f9;
				display:flex;
				flex-direction:column;
				overflow:hidden;
				border-radius:10px 10px 0 0;
			`,
			innerHTML:`
				<div style="
					padding:10px;
					height:48px;
					display:flex;
					align-items:center;
					justify-content:center;
					position:relative;
				">
					<div style="
						position: absolute;
				    left: 10px;
				    padding: 10px;
				    width: 32px;
				    height: 32px;
				    cursor:pointer;
					" id=backbutton>
						<img src=./more/media/back.png>
					</div>
					<div class=bold>Produk Data</div>
				</div>
				<div id=menu style="
					border:0;
					border-radius:0;
					padding:10px;
					width:auto;
					border-bottom:1px solid gainsboro;
					height:54px;
				">
        	<div id=Pulsa>Pulsa</div>
	        <div id=Games>Games</div>
	        <div id=PLN>Pln</div>
        	<div id=Emoney>E-money</div>
	      </div>
				<div style="
					height:100%;
					overflow:auto;
					padding:10px;
				" id=pplace>
					
				</div>
			`,
			close(){
				app.topLayer.hide();
				app.body.style.overflow = 'auto';
				this.remove();
			},
			handleNav(){
				this.findall('#menu div').forEach(btn=>{
					console.log('called');
					btn.onclick = ()=>{
						app[`open${btn.id}`]();
					}
				})
			},
			onadded(){
				this.find('#backbutton').onclick = ()=>{
					this.close();
				}
				this.pplace = this.find('#pplace');
				this.handleNav();
				this.anim({
					targets:this,
					height:['0','100%'],
					duration:1000
				})
				this.generateProducts();
			},
			generateProducts(){
				const products = [];
				for(let i in app.products.Voucher){
					products.push(app.products.Voucher[i]);
				}
				let loopLen = products.length/2;
				if(products.length % 2 !== 0){
					loopLen = (products.length + 1) / 2
				}
				let index = 0;
				for(let i=0;i<loopLen;i++){
					this.pplace.addChild(makeElement('div',{
						style:'display:flex;gap:10px;',
						onadded(){
							for(let j=0;j<3;j++){
								const thumbnail = products[index]?products[index].data[0].thumbnail:null;
								let category = products[index]?products[index].data[0].category.toLowerCase():null;
								let brand = products[index]?products[index].data[0].brand.toLowerCase():null;
								if(thumbnail){
									category = category[0].toUpperCase() + category.slice(1);
									brand = brand[0].toUpperCase() + brand.slice(1);
								}
								this.addChild(makeElement('div',{
									category:products[index]?products[index].data[0].category:null,
									brand:products[index]?products[index].data[0].brand:null,
									style:`width:100%;opacity:${!thumbnail?0:1};cursor:${!thumbnail?'unset':'pointer'};`,
									innerHTML:`
										<div style="
											${i===0?'padding-top:20px;':''}
											border-radius:5px 5px 0 0;
											padding-bottom:10px;
										">
											<div style="
					              width:100%;
					              height:100%;
					              display: flex;
					              justify-content: center;
					            ">
					              <img src="${thumbnail}" style="
					                width:90px;
					                height:90px;
					                object-fit: cover;
					                border-radius:5px;
					                margin-top:15px;
					              ">
					            </div>
										</div>
										<div style="
											border:none;
											border-radius:0 0 5px 5px;
											margin-bottom:10px;cursor:unset;
											text-align:center;
										">${'Data '+brand}</div>
									`,
									onclick(){
										app.openDetailsProduct({
											title:`${category + ' ' +brand}`,
											details:app.products[this.category][this.brand].details,
											products:app.products[this.category][this.brand].data
										});
									}
								}))
								index += 1;
							}
						}
					}))
				}
			}
		})
	},
	gameProducts(){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				background:#f5f5f9;
				display:flex;
				flex-direction:column;
				overflow:hidden;
				border-radius:10px 10px 0 0;
			`,
			innerHTML:`
				<div style="
					padding:10px;
					height:48px;
					display:flex;
					align-items:center;
					justify-content:center;
					position:relative;
				">
					<div style="
						position: absolute;
				    left: 10px;
				    padding: 10px;
				    width: 32px;
				    height: 32px;
				    cursor:pointer;
					" id=backbutton>
						<img src=./more/media/back.png>
					</div>
					<div class=bold>Produk Games</div>
				</div>
				<div id=menu style="
					border:0;
					border-radius:0;
					padding:10px;
					width:auto;
					border-bottom:1px solid gainsboro;
					height:54px;
				">
        	<div id=Pulsa>Pulsa</div>
        	<div id=Data>Data</div>
	        <div id=PLN>Pln</div>
        	<div id=Emoney>E-money</div>
	      </div>
				<div style="
					height:100%;
					overflow:auto;
					padding:10px;
				" id=pplace>
				</div>
			`,
			close(){
				app.topLayer.hide();
				app.body.style.overflow = 'auto';
				this.remove();
			},
			handleNav(){
				this.findall('#menu div').forEach(btn=>{
					console.log('called');
					btn.onclick = ()=>{
						app[`open${btn.id}`]();
					}
				})
			},
			onadded(){
				this.find('#backbutton').onclick = ()=>{
					this.close();
				}
				this.pplace = this.find('#pplace');
				this.handleNav();
				this.anim({
					targets:this,
					height:['0','100%'],
					duration:1000
				})
				this.generateProducts();
			},
			generateProducts(){
				const products = [];
				for(let i in app.products.Games){
					products.push(app.products.Games[i]);
				}
				let loopLen = products.length/2;
				if(products.length % 2 !== 0){
					loopLen = (products.length + 1) / 2
				}
				let index = 0;
				for(let i=0;i<loopLen;i++){
					this.pplace.addChild(makeElement('div',{
						style:'display:flex;gap:10px;',
						onadded(){
							for(let j=0;j<3;j++){
								const thumbnail = products[index]?products[index].data[0].thumbnail:null;
								let category = products[index]?products[index].data[0].category.toLowerCase():null;
								let brand = products[index]?products[index].data[0].brand.toLowerCase():null;
								if(thumbnail){
									category = category[0].toUpperCase() + category.slice(1);
									brand = brand[0].toUpperCase() + brand.slice(1);
								}
								this.addChild(makeElement('div',{
									category:products[index]?products[index].data[0].category:null,
									brand:products[index]?products[index].data[0].brand:null,
									style:`width:100%;opacity:${!thumbnail?0:1};cursor:${!thumbnail?'unset':'pointer'};`,
									innerHTML:`
										<div style="
											${i===0?'padding-top:20px;':''}
											border-radius:5px 5px 0 0;
											padding-bottom:10px;
										">
											<div style="
					              width:100%;
					              height:100%;
					              display: flex;
					              justify-content: center;
					            ">
					              <img src="${thumbnail}" style="
					                width:90px;
					                height:90px;
					                object-fit: cover;
					                border-radius:5px;
					                margin-top:15px;
					              ">
					            </div>
										</div>
										<div style="
											border:none;
											border-radius:0 0 5px 5px;
											margin-bottom:10px;cursor:unset;
											text-align:center;
										">${brand}</div>
									`,
									onclick(){
										app.openDetailsProduct({
											title:`${category + ' ' +brand}`,
											details:app.products[this.category][this.brand].details,
											products:app.products[this.category][this.brand].data
										});
									}
								}))
								index += 1;
							}
						}
					}))
				}
			}
		})
	},
	plnProducts(){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				background:#f5f5f9;
				display:flex;
				flex-direction:column;
				overflow:hidden;
				border-radius:10px 10px 0 0;
			`,
			innerHTML:`
				<div style="
					padding:10px;
					height:48px;
					display:flex;
					align-items:center;
					justify-content:center;
					position:relative;
				">
					<div style="
						position: absolute;
				    left: 10px;
				    padding: 10px;
				    width: 32px;
				    height: 32px;
				    cursor:pointer;
					" id=backbutton>
						<img src=./more/media/back.png>
					</div>
					<div class=bold>Produk PLN</div>
				</div>
				<div id=menu style="
					border:0;
					border-radius:0;
					padding:10px;
					width:auto;
					border-bottom:1px solid gainsboro;
					height:54px;
				">
        	<div id=Pulsa>Pulsa</div>
        	<div id=Data>Data</div>
        	<div id=Games>Games</div>
        	<div id=Emoney>E-money</div>
	      </div>
				<div style="
					height:100%;
					overflow:auto;
					padding:10px;
					background:whitesmoke;
				" id=pplace>
				</div>
			`,
			close(){
				app.topLayer.hide();
				app.body.style.overflow = 'auto';
				this.remove();
			},
			handleNav(){
				this.findall('#menu div').forEach(btn=>{
					console.log('called');
					btn.onclick = ()=>{
						app[`open${btn.id}`]();
					}
				})
			},
			onadded(){
				this.find('#backbutton').onclick = ()=>{
					this.close();
				}
				this.pplace = this.find('#pplace');
				this.handleNav();
				this.anim({
					targets:this,
					height:['0','100%'],
					duration:1000
				})
				this.generateProducts();
			},
			generateProducts(){
				const products = [];
				for(let i in app.products.PLN){
					products.push(app.products.PLN[i]);
				}
				let loopLen = products.length/2;
				if(products.length % 2 !== 0){
					loopLen = (products.length + 1) / 2
				}
				let index = 0;
				for(let i=0;i<loopLen;i++){
					this.pplace.addChild(makeElement('div',{
						style:'display:flex;gap:10px;',
						onadded(){
							for(let j=0;j<3;j++){
								const thumbnail = products[index]?products[index].data[0].thumbnail:null;
								let category = products[index]?products[index].data[0].category.toLowerCase():null;
								let brand = products[index]?products[index].data[0].brand.toLowerCase():null;
								if(thumbnail){
									category = category[0].toUpperCase() + category.slice(1);
									brand = brand[0].toUpperCase() + brand.slice(1);
								}
								this.addChild(makeElement('div',{
									category:products[index]?products[index].data[0].category:null,
									brand:products[index]?products[index].data[0].brand:null,
									style:`width:100%;opacity:${!thumbnail?0:1};cursor:${!thumbnail?'unset':'pointer'};`,
									innerHTML:`
										<div style="
											${i===0?'padding-top:20px;':''}
											border-radius:5px 5px 0 0;
											padding-bottom:10px;
										">
											<div style="
					              width:100%;
					              height:100%;
					              display: flex;
					              justify-content: center;
					            ">
					              <img src="${thumbnail}" style="
					                width:90px;
					                height:90px;
					                object-fit: cover;
					                border-radius:5px;
					                margin-top:15px;
					              ">
					            </div>
										</div>
										<div style="
											border:none;
											border-radius:0 0 5px 5px;
											margin-bottom:10px;cursor:unset;
											text-align:center;
										">${brand}</div>
									`,
									onclick(){
										app.openDetailsProduct({
											title:`${category + ' ' +brand}`,
											details:app.products[this.category][this.brand].details,
											products:app.products[this.category][this.brand].data
										});
									}
								}))
								index += 1;
							}
						}
					}))
				}
			}
		})
	},
	randomProducts(param){
		return makeElement('div',{
			style:'width:100%;',
			innerHTML:`
			`,
			generate(){
				let index = 0;
				for(let i=0;i<3;i++){
					this.addChild(makeElement('div',{
						className:'item',
						onadded(){
							for(let j=0;j<3;j++){
								let category = param[index].category.toLowerCase();
								category = category[0].toUpperCase() + category.slice(1);
								let brand = param[index].brand.toLowerCase();
								brand = brand[0].toUpperCase() + brand.slice(1);

								this.addChild(makeElement('div',{
									className:'box',brand:param[index].brand,category:param[index].category,
									innerHTML:`
										<div style="
				              width:100%;
				              height:100%;
				              display: flex;
				              justify-content: center;
				              padding:20px 0;
				              padding-bottom:5px;
				            ">
				              <img src="${param[index].thumbnail}" style="
				                width:90px;
				                height:90px;
				                object-fit: cover;
				                border-radius:5px;
				              ">
				            </div>
				            <div style="
				              width:100%;
				              height:100%;
				              top:0;
				              display: flex;
				              align-items:flex-end;
				            ">
				              <div style="
				                padding: 0 15px;
				                width: 90%;
				                text-align: center;
				                background: whitesmoke;
				                color: black;
				                white-space:nowrap;
				                font-size:13px;
				              ">${category + ' ' +brand}</div>
				            </div>
									`,
									onclick(){
										app.openDetailsProduct({
											title:`${category + ' ' +brand}`,
											details:app.products[this.category][this.brand].details,
											products:app.products[this.category][this.brand].data
										});
									}
								}))
								index += 1;
							}
						}
					}))
				}
			},
			onadded(){
				this.generate();
			}
		})
	},
	feedBack(orderId){
		return makeElement('div',{
			style:`
				position: fixed;
			  top:0;
			  left:0;
			  width: 100%;
			  height: 100%;
			  display: flex;
			  align-items: flex-start;
			  justify-content: center;
			  z-index: 14;
			  background: rgb(225 225 225 / 47%);
			`,
			innerHTML:`
				<div style="
					background:white;
					border-radius:5px;
					margin-top:20px;
					display:flex;
					flex-direction:column;
					position:absolute;
					top:0;
					overflow:auto;
				" class="smartWidth card" id=box>
					<div style="
						padding:20px;
						border-bottom:1px solid gainsboro;
						display:flex;
						align-items:center;
						justify-content:center;
						position:relative;
						border-radius:10px 10px 0 0;
					">
						<div style="
							position:absolute;
							left:20px;cursor:pointer;
						" id=backbutton>
							<img src=./more/media/back.png>
						</div>
						<div>Tuliskan Masukan Anda</div>
					</div>
					<div style="
						padding:20px;
						height:100%;
					" id=displaybox>
						<div id=ratings style="margin-bottom:10px;display:flex;gap:20px;align-items:center;">
							<div id=star></div>
							<div id=label>1/5</div>
						</div>
						<div>
							<div style=display:flex;>
								<textarea placeholder="Tulis Masukan Anda Disini!" id=value></textarea>
							</div>
						</div>
					</div>
					<div style="padding:0 10px;">
						<div class=goldbutton style=margin-bottom:10px; id=confirmbutton>Kirim Masukan</div>
					</div>
				</div>
			`,
			handleRatingsSystem(){
				this.ratings.addChild(makeElement('div',{
					label:this.label,
					ratevalue:0,
					id:'thevalue',
					style:'display:flex;gap:5px;',
					showHoverActions(index){
						this.findall('img').forEach((img,i)=>{
							if(i<=index){
								img.src = './more/media/activestar.png'
							}else{
								img.src = './more/media/inactivestar.png'
							}
						})
						this.label.innerHTML = `${index + 1}/5`;
						this.ratevalue = index + 1;
					},
					itemclicked(index){
						this.findall('img').forEach((img,i)=>{
							if(i<=index){
								img.src = './more/media/activestar.png'
							}else{
								img.src = './more/media/inactivestar.png'
							}
						})
						this.label.innerHTML = `${index + 1}/5`;
						this.ratevalue = index + 1;
					},
					onadded(){
						for(let i=0;i<5;i++){
							this.addChild(makeElement('div',{
								parent:this,index:i,style:'cursor:pointer;',
								onmouseover(){
									this.parent.showHoverActions(this.index);
								},
								onadded(){
									this.img = this.find('img');
								},
								onclick(){
									this.parent.itemclicked(this.index);
								},
								innerHTML:`<img src=./more/media/${i>0 ? 'inactivestar':'activestar'}.png>`
							}))
						}
					}
				}))
			},
			onadded(){
				this.displaybox = this.find('#displaybox');
				this.ratings = this.find('#ratings #star');
				this.label = this.find('#ratings #label');
				this.find('#backbutton').onclick = ()=>{
					this.remove();
				}
				this.find('#confirmbutton').onclick = async ()=>{
					const value = this.find('textarea').value;
					this.displaybox.replaceChild(makeElement('div',{
						innerHTML:'Mengirim Masukan Anda!',
						style:'font-size:12px;color:gray;font-weight:bold;'
					}))
					const response = await new Promise((resolve,reject)=>{
						cOn.post({
							url:`${app.baseUrl}/newfeedback`,
							someSettings:[['setRequestHeader','content-type','application/json']],
							data:JSON.stringify({
								orderId,value,ratevalue:this.ratings.find('#thevalue').ratevalue
							}),
							onload(){
								resolve(this.responseText);
							}
						})	
					})
					app.showWarnings(response);
					this.remove();
				}
				this.anim({
					targets:this.find('#box'),
					height:['0','400px'],
					duration:1000,
					complete:() => {
						this.find('#box').style.height = 'auto';
					}
				})
				this.handleRatingsSystem();
			}
		})
	},
	customerSupport(){
		return makeElement('div',{
			style:`
				position: fixed;
		    background: #8973df;
		    height: 32px;
		    padding: 10px;
		    display: flex;
		    bottom: 10px;
		    right: 10px;
		    color: white;
		    align-items: center;
		    border-radius:5px;
		    border:1px solid gainsboro;
		    cursor:pointer;
		    z-index:15;
			`,
			innerHTML:`
				<div>
					<img src=./more/media/customersupport.png>
				</div>
			`,
			onclick(){
				app.openCsInput();
			}
		})
	},
	csInput(){
		return makeElement('div',{
			style:`
				z-index:16;
				background:rgb(245 245 245 / 86%);
				position:fixed;
				top:0;
				left:0;
				width:100%;
				height:100%;
				display:flex;
				justify-content:center;
			`,
			innerHTML:`
				<div class=smartWidth style=margin-top:30px;>
					<div style="
						background:white;
						padding:20px;
						border-radius:5px;
						border:1px solid gainsboro;
					">
						<div style="
							padding-bottom:20px;
							border-bottom:1px solid gainsboro;
							display:flex;
							align-items:center;
							justify-content:center;
							position:relative;
							border-radius:10px 10px 0 0;
							margin-bottom:20px;
						">
							<div style="
								position:absolute;
								left:0;cursor:pointer;
							" id=backbutton>
								<img src=./more/media/back.png>
							</div>
							<div>Tuliskan Keluhan Anda</div>
						</div>
						<div style="margin-bottom:10px;">
							<div style="margin-bottom:5px;">Informasi Kontak ( Whatsapp )</div>
							<div style=display:flex;>
								<input placeholder="Lampirkan Informasi Kontak...">
							</div>
						</div>
						<div style="margin-bottom:10px;">
							<div style="margin-bottom:5px;">Sampaikan Keluhan</div>
							<div style=display:flex;>
								<textarea placeholder="Tuliskan Keluhan Anda..."></textarea>
							</div>
						</div>
						<div style="
							padding:20px;
							background:#8973df;
							color:white;
							border-radius:5px;
							text-align:center;
							cursor:pointer;
						" id=sendbutton>Kirim Keluhan</div>
					</div>
				</div>
			`,
			onadded(){
				this.find('#backbutton').onclick = ()=>{
					this.remove();
				}
				this.find('#sendbutton').onclick = ()=>{
					this.sendCsFeedback();
				}
			},
			async sendCsFeedback(){
				const timeId = Date.parse(new Date().toLocaleString('en-US',{ timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })).toString();
				const contactInfo = this.find('input').value;
				const value = this.find('textarea').value;
				if(!contactInfo.length || !value.length){
					return app.showWarnings(`Mohon periksa kembali data ${!value.length ? 'keluhan' : 'informasi kontak'} anda untuk melanjutkan!`);
				}
				const response = await new Promise((resolve,reject)=>{
					cOn.post({
						url:`${app.baseUrl}/newcsfeedback`,
						someSettings:[['setRequestHeader','content-type','application/json']],
						data:jsonstr({timeId,contactInfo,feedValue:value}),
						onload(){
							resolve(this.getJSONResponse());
						}
					})
				})
				if(response.valid){
					app.showWarnings('Berhasil mengirim keluhan!');
					this.remove();
				}else app.showWarnings('Terjadi kesalahan! moho coba lagi nanti');
			}
		})
	},
	guaranteeType(order){
		return makeElement('div',{
			style:`
				z-index:16;
				background:rgb(245 245 245 / 86%);
				position:fixed;
				top:0;
				left:0;
				width:100%;
				height:100%;
				display:flex;
				justify-content:center;
			`,
			innerHTML:`
				<div class=smartWidth style=margin-top:30px;>
					<div style="
						background:white;
						padding:20px;
						border-radius:5px;
						border:1px solid gainsboro;
					">
						<div style="
							padding-bottom:20px;
							border-bottom:1px solid gainsboro;
							display:flex;
							align-items:center;
							justify-content:center;
							position:relative;
							border-radius:10px 10px 0 0;
							margin-bottom:20px;
						">
							<div style="
								position:absolute;
								left:0;cursor:pointer;
							" id=backbutton>
								<img src=./more/media/back.png>
							</div>
							<div>Klaim Garansi</div>
						</div>
						<div style="
							padding:20px;
							background:#8973df;
							color:white;
							border-radius:5px;
							text-align:center;
							cursor:pointer;
							margin-bottom:10px;
						" id=reorderbutton>Order Ulang</div>
						<div style="
							padding:20px;
							background:#8973df;
							color:white;
							border-radius:5px;
							text-align:center;
							cursor:pointer;
						" id=claimsaldo>Klaim Saldo</div>
					</div>
				</div>
			`,
			onadded(){
				this.find('#backbutton').onclick = ()=>{
					this.remove();
				}
				this.find('#reorderbutton').onclick = ()=>{
					this.doReorder();
				}
				this.find('#claimsaldo').onclick = ()=>{
					this.claimSaldo();
				}
			},
			async doReorder(){
				//we gonna make new request order.
				const reorderData = order;
				reorderData.reorder = true;
				const results = await new Promise((resolve,reject)=>{
					cOn.post({
						url:`${app.baseUrl}/dopayment`,
						someSettings:[['setRequestHeader','Content-type','application/json']],
						data:jsonstr(reorderData),
						onload(){
							resolve(this.getJSONResponse());
						}
					})
				})
				if(!results.ok){
					app.showWarnings(results.message);
					this.remove();
				}else{
					app.openPaymentDetails(results.data,true);
					this.remove();	
				}
			},
			async claimSaldo(){
				const response = await new Promise((resolve,reject)=>{
					cOn.get({
						url:`${app.baseUrl}/saldoclaim?orderId=${order.payments.orderId}&&saldoId=${localStorage.getItem('saldoId')||''}`,
						onload(){
							resolve(this.getJSONResponse());
						}
					})
				})
				if(!response.valid){
					return app.showWarnings(response.message);
				}
				localStorage.setItem('saldoId',response.saldoId);
				app.showWarnings('Saldo berhasil diklaim!');
				this.remove();
			}
		})
	},
	getSaldoId(){
		return makeElement('div',{
			style:`
				z-index:16;
				background:rgb(245 245 245 / 86%);
				position:fixed;
				top:0;
				left:0;
				width:100%;
				height:100%;
				display:flex;
				justify-content:center;
			`,
			innerHTML:`
				<div class=smartWidth style=margin-top:30px;>
					<div style="
						background:white;
						padding:20px;
						border-radius:5px;
						border:1px solid gainsboro;
					">
						<div style="
							padding-bottom:20px;
							border-bottom:1px solid gainsboro;
							display:flex;
							align-items:center;
							justify-content:center;
							position:relative;
							border-radius:10px 10px 0 0;
							margin-bottom:20px;
						">
							<div style="
								position:absolute;
								left:0;cursor:pointer;
							" id=backbutton>
								<img src=./more/media/back.png>
							</div>
							<div>Masukan SaldoId Anda!</div>
						</div>
						<div style="
							border-radius:5px;
							text-align:center;
							cursor:pointer;
							margin-bottom:10px;
							display:flex;
						" id=reorderbutton>
							<input placeholder="Masukan saldoId anda...">
						</div>
						<div style="margin:15px 0;font-size:12px;color:red">Anda dapat menggunakan saldo ini untuk bertransaksi.</div>
						<div style="
							padding:15px;
							background:#8973df;
							color:white;
							border-radius:5px;
							text-align:center;
							cursor:pointer;
						" id=claimsaldo>Simpan</div>
					</div>
				</div>
			`,
			onadded(){
				this.find('#backbutton').onclick = ()=>{
					this.remove();
				}
				this.find('#claimsaldo').onclick = ()=>{
					const saldoId = this.find('input').value;
					if(saldoId.length < 13 || isNaN(saldoId))
						return app.showWarnings('Periksa kembali saldoId anda!');
					localStorage.setItem('saldoId',saldoId);
					app.openHistory();
					this.remove();
				}
			}
		})
	},
	loginPage(){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				height:100%;
				background:#f5f5f9;
			`,
			innerHTML:`
				<div style="
					background:white;
					padding:20px;
					border-radius:0.5rem;
					margin-top:20px;
					background-clip: padding-box;
    			box-shadow: 0 2px 6px 0 rgba(67, 89, 113, 0.12);
				">
					<div style="
						text-align: center;
				    opacity: 1;
				    transition: opacity 0.15s ease-in-out;
				    color: #697a8d !important;
				    font-weight: 900 !important;
				    margin-bottom: 30px;
					">Login Member</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 10px;
				    color:#566a7f;
					">
						<div>Username</div>
						<div style=display:flex;>
							<input class=formc placeholder="Masukan Username Anda...">
						</div>
					</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 20px;
				    color:#566a7f;
					">
						<div>Password</div>
						<div id=passwordmechanism>
							<div style=display:flex;gap:10px;>
								<input type=password class=formc placeholder="Masukan Password Anda..." id=1>
								<img src=./more/media/hide.png style="
									object-fit:contain;
									cursor:pointer;
								" id=0_1>
							</div>
							<div style=display:flex;gap:10px;display:none;>
								<input class=formc placeholder="Masukan Password Anda..." id=0>
								<img src=./more/media/show.png style="
									object-fit:contain;
									cursor:pointer;
									width:24px;
								" id=1_0>
							</div>
						</div>
					</div>
					<div style="
						padding: 10px;
				    background: #303f9f !important;
				    color: white;
				    border-radius: 0.375rem;
				    text-align: center;
				    /* font-weight: 400; */
				    font-size: 0.9375rem;
				    font-weight: bold;
				    cursor: pointer;
				    border: 1px solid #696cff;
					">Login Sekarang</div>
					<div style="
						margin-top: 15px;
				    cursor: pointer;
				    color: #696cff;
				    font-weight: bold;
					" id=lupapass>Lupa Password?</div>
				</div>
			`,
			onadded(){
				this.define();
				this.initPasswordMechanism();
				this.lupaPassInit();
			},
			define(){
				this.passparent = this.find('#passwordmechanism');
				this.lupapass = this.find('#lupapass');
			},
			initPasswordMechanism(){
				const divs = this.passparent.findall('div');
				const inputs = this.passparent.findall('input');
				this.passparent.findall('img').forEach(img=>{
					img.onclick = ()=>{
						const cmd = img.id.split('_');
						divs[Number(cmd[0])].hide();
						divs[Number(cmd[1])].show('flex');
						divs[Number(cmd[1])].find('input').focus();
					}
				})
				inputs.forEach((input)=>{
					input.oninput = ()=>{
						inputs[Number(input.id)].value = input.value;
					}
				})
			},
			lupaPassInit(){
				this.lupapass.onclick = ()=>{
					app.openLupaPass();
				}
			}
		})
	},
	regisPage(){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				height:100%;
				background:#f5f5f9;
			`,
			innerHTML:`
				<div style="
					background:white;
					padding:20px;
					border-radius:0.5rem;
					margin-top:20px;
					background-clip: padding-box;
    			box-shadow: 0 2px 6px 0 rgba(67, 89, 113, 0.12);
				">
					<div style="
						text-align: center;
				    opacity: 1;
				    transition: opacity 0.15s ease-in-out;
				    color: #697a8d !important;
				    font-weight: 900 !important;
				    margin-bottom: 30px;
					">New Member</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 10px;
				    color:#566a7f;
					">
						<div>Nama Lengkap</div>
						<div style=display:flex;>
							<input class=formc placeholder="Masukan Nama Anda...">
						</div>
					</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 10px;
				    color:#566a7f;
					">
						<div>Email Atau Username</div>
						<div style=display:flex;>
							<input class=formc placeholder="Masukan Email Anda...">
						</div>
					</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 10px;
				    color:#566a7f;
					">
						<div>Nomor Whatsapp</div>
						<div style=display:flex;align-items:center;>
							<input type=number class=formc placeholder="Masukan No Whatsapp Anda..." style="
								border-radius:8px 0 0 8px;
							">
							<div style="
								color: #fff;
						    background-color: #303f9f !important;
						    border-color: #696cff;
						    box-shadow: 0 0.125rem 0.25rem 0 rgba(105, 108, 255, 0.4);
						    white-space:nowrap;
						    padding:9px;
						    border-radius:0 8px 8px 0;
						    cursor:pointer;
							">Kirim Otp</div>
						</div>
					</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 10px;
				    color:#566a7f;
					">
						<div>Kode Otp</div>
						<div style=display:flex;>
							<input type=number class=formc placeholder="Masukan Kode Otp...">
						</div>
					</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 20px;
				    color:#566a7f;
					">
						<div>Password</div>
						<div id=passwordmechanism>
							<div style=display:flex;gap:10px;>
								<input type=password class=formc placeholder="Masukan Password Anda..." id=1>
								<img src=./more/media/hide.png style="
									object-fit:contain;
									cursor:pointer;
								" id=0_1>
							</div>
							<div style=display:flex;gap:10px;display:none;>
								<input class=formc placeholder="Masukan Password Anda..." id=0>
								<img src=./more/media/show.png style="
									object-fit:contain;
									cursor:pointer;
									width:24px;
								" id=1_0>
							</div>
						</div>
					</div>
					<div style="
						padding: 10px;
				    background: #303f9f !important;
				    color: white;
				    border-radius: 0.375rem;
				    text-align: center;
				    /* font-weight: 400; */
				    font-size: 0.9375rem;
				    font-weight: bold;
				    cursor: pointer;
				    border: 1px solid #696cff;
					">Daftar Sekarang</div>
				</div>
			`,
			onadded(){
				this.define();
				this.initPasswordMechanism();
			},
			define(){
				this.passparent = this.find('#passwordmechanism');
			},
			initPasswordMechanism(){
				const divs = this.passparent.findall('div');
				const inputs = this.passparent.findall('input');
				this.passparent.findall('img').forEach(img=>{
					img.onclick = ()=>{
						const cmd = img.id.split('_');
						divs[Number(cmd[0])].hide();
						divs[Number(cmd[1])].show('flex');
						divs[Number(cmd[1])].find('input').focus();
					}
				})
				inputs.forEach((input)=>{
					input.oninput = ()=>{
						inputs[Number(input.id)].value = input.value;
					}
				})
			}
		})
	},
	cekPesanan(){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				height:100%;
				background:#f5f5f9;
			`,
			innerHTML:`
				<div style="
					background:white;
					padding:20px;
					border-radius:0.5rem;
					margin-top:20px;
					background-clip: padding-box;
    			box-shadow: 0 2px 6px 0 rgba(67, 89, 113, 0.12);
				">
					<div style="
						text-align: center;
				    opacity: 1;
				    transition: opacity 0.15s ease-in-out;
				    color: #697a8d !important;
				    font-weight: 900 !important;
				    margin-bottom: 30px;
					">Cek Pesanan</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 20px;
				    color:#566a7f;
					">
						<div>Masukan Id Transaksi</div>
						<div style=display:flex;>
							<input class=formc placeholder="Masukan Transaksi Id Anda...">
						</div>
					</div>
					<div style="
						padding: 10px;
				    background: #303f9f !important;
				    color: white;
				    border-radius: 0.375rem;
				    text-align: center;
				    /* font-weight: 400; */
				    font-size: 0.9375rem;
				    font-weight: bold;
				    cursor: pointer;
				    border: 1px solid #696cff;
					">Cek Sekarang</div>
				</div>
			`
		})
	},
	callCsPage(){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				height:100%;
				background:#f5f5f9;
			`,
			innerHTML:`
				<div style="
					background:white;
					padding:20px;
					border-radius:0.5rem;
					margin-top:20px;
					background-clip: padding-box;
    			box-shadow: 0 2px 6px 0 rgba(67, 89, 113, 0.12);
				">
					<div style="
						text-align: center;
				    opacity: 1;
				    transition: opacity 0.15s ease-in-out;
				    color: #697a8d !important;
				    font-weight: 900 !important;
				    margin-bottom: 30px;
					">Kontak</div>
					<div style="
						display: flex;
				    gap: 10px;
				    margin-bottom: 20px;
				    color: #566a7f;
				    padding: 1rem !important;
				    background-clip: padding-box;
				    box-shadow: 0 2px 6px 0 rgba(67, 89, 113, 0.12);
				    border-radius: 8px;
				    font-weight: 500;
				    cursor: pointer;
				    align-items: center;
    				justify-content: space-between;
					">
						Whatsapp
						<img src="https://v3.kiosmoba.com/vendor/assets/img/icons/unicons/whatsapp_icon.png" width=30>
					</div>
					<div style="
						display: flex;
				    gap: 10px;
				    margin-bottom: 20px;
				    color: #566a7f;
				    padding: 1rem !important;
				    background-clip: padding-box;
				    box-shadow: 0 2px 6px 0 rgba(67, 89, 113, 0.12);
				    border-radius: 8px;
				    font-weight: 500;
				    cursor: pointer;
				    align-items: center;
    				justify-content: space-between;
					">
						Email
						<img src="https://v3.kiosmoba.com/vendor/assets/img/icons/unicons/icons-mail.png" width=25>
					</div>
				</div>
			`
		})
	},
	moreMenu(){
		return makeElement('div',{
			className:'smartWidthMoreMenu',
			style:`
				height:100%;
			`,
			innerHTML:`
				<div style="
					background:#f5f5f9;
					width:60%;
					height:100%;
					background-clip: padding-box;
					border-right:1px solid gainsboro;
				" id=whitemoremenu>
					<div style="
						padding:15px;
						display:flex;
						justify-content:flex-end;
						align-items:center;
					">
						<div style="
							display:flex;
							align-items:center;
						" id=close>
							<img src=./more/media/close.png width=16 style=cursor:pointer;>
						</div>
					</div>
					<div style="
						padding:15px;
					" class="columnMenuParent">
						<div class="bottomMenu blackHover" id=History>Histori</div>
						<div class="bottomMenu blackHover" id=PriceList>Daftar Harga</div>
						<div class="bottomMenu blackHover" id=TermOfUse>Syarat Dan Ketentuan</div>
					</div>
				</div>
			`,
			onadded(){
				this.define();
				this.itemsClickInit();
			},
			define(){
				this.clmnParent = this.find('.columnMenuParent');
				this.closeButton = this.find('#close');
				this.closeButton.onclick = ()=>{
					app.topLayerClose();
				}
			},
			itemsClickInit(){
				this.clmnParent.findall('div').forEach((div)=>{
					div.onclick = ()=>{
						app.hideAndShow();
						app.topLayerSetBackground();
						app[`open${div.id}`]();
					}
				})
			}
		})
	},
	lupaPassPage(){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				height:100%;
				background:#f5f5f9;
			`,
			innerHTML:`
				<div style="
					background:white;
					padding:20px;
					border-radius:0.5rem;
					margin-top:20px;
					background-clip: padding-box;
    			box-shadow: 0 2px 6px 0 rgba(67, 89, 113, 0.12);
				">
					<div style="
						text-align: center;
				    opacity: 1;
				    transition: opacity 0.15s ease-in-out;
				    color: #697a8d !important;
				    font-weight: 900 !important;
				    margin-bottom: 30px;
					">Password Baru</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 10px;
				    color:#566a7f;
					">
						<div>Nomor Whatsapp</div>
						<div style=display:flex;align-items:center;>
							<input type=number class=formc placeholder="Masukan No Whatsapp Anda..." style="
								border-radius:8px 0 0 8px;
							">
							<div style="
								color: #fff;
						    background-color: #303f9f !important;
						    border-color: #696cff;
						    box-shadow: 0 0.125rem 0.25rem 0 rgba(105, 108, 255, 0.4);
						    white-space:nowrap;
						    padding:9px;
						    border-radius:0 8px 8px 0;
						    cursor:pointer;
							">Kirim Otp</div>
						</div>
					</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 10px;
				    color:#566a7f;
					">
						<div>OTP</div>
						<div style=display:flex;>
							<input class=formc placeholder="Masukan Otp...">
						</div>
					</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 20px;
				    color:#566a7f;
					">
						<div>Password Baru</div>
						<div id=passwordmechanism>
							<div style=display:flex;gap:10px;>
								<input type=password class=formc placeholder="Masukan Password Anda..." id=1>
								<img src=./more/media/hide.png style="
									object-fit:contain;
									cursor:pointer;
								" id=0_1>
							</div>
							<div style=display:flex;gap:10px;display:none;>
								<input class=formc placeholder="Masukan Password Anda..." id=0>
								<img src=./more/media/show.png style="
									object-fit:contain;
									cursor:pointer;
									width:24px;
								" id=1_0>
							</div>
						</div>
					</div>
					<div style="
						padding: 10px;
				    background: #303f9f !important;
				    color: white;
				    border-radius: 0.375rem;
				    text-align: center;
				    /* font-weight: 400; */
				    font-size: 0.9375rem;
				    font-weight: bold;
				    cursor: pointer;
				    border: 1px solid #696cff;
					">Konfirmasi Perubahan</div>
				</div>
			`,
			onadded(){
				this.define();
				this.initPasswordMechanism();
			},
			define(){
				this.passparent = this.find('#passwordmechanism');
			},
			initPasswordMechanism(){
				const divs = this.passparent.findall('div');
				const inputs = this.passparent.findall('input');
				this.passparent.findall('img').forEach(img=>{
					img.onclick = ()=>{
						const cmd = img.id.split('_');
						divs[Number(cmd[0])].hide();
						divs[Number(cmd[1])].show('flex');
						divs[Number(cmd[1])].find('input').focus();
					}
				})
				inputs.forEach((input)=>{
					input.oninput = ()=>{
						inputs[Number(input.id)].value = input.value;
					}
				})
			}
		})
	},
	priceListPage(){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				height:100%;
				background:#f5f5f9;
				overflow:auto;
			`,
			innerHTML:`
				<div style="
					padding:20px;
					margin-top:20px;
					display:flex;
					flex-direction:column;
					gap:20px;
					padding-bottom:150px;
				" id=parent>
					<div style="
						text-align: center;
				    opacity: 1;
				    transition: opacity 0.15s ease-in-out;
				    color: #697a8d !important;
				    font-weight: 900 !important;
				    margin-bottom: 30px;
					">Daftar Harga</div>
					<div class=card style="
						background:white;
						border-radius:8px;
						padding:15px;
						position:sticky;
						top:10px;
						margin-bottom:10px;
					">
						<div class=bold style=margin-bottom:5px;>Filter</div>
						<div>
							<select>
								<option value=all>Semua</option>
							</select>
						</div>
					</div>
				</div>
			`,
			onadded(){
				this.define();
				this.generateData();
				this.initSelectEvent();
			},
			define(){
				this.parent = this.find('#parent');
				this.select = this.parent.find('select');
			},
			generateOption(param){
				// working on select
				this.select.addChild(makeElement('option',{
					innerHTML:param,
					value:param
				}))
			},
			initSelectEvent(){
				this.itemcs = this.findall('.itemcontainer');
				this.select.onchange = ()=>{
					this.itemcs.forEach((item)=>{
						item.show();
						if(this.select.value === 'all')
							return;
						if(item.id !== this.select.value)
							item.hide();
					})
				}
			},
			generateData(){
				for(let i in app.products){
					for(let j in app.products[i]){
						this.generateOption(j);
						this.parent.addChild(makeElement('div',{
							id:j,
							className:'itemcontainer',
							innerHTML:`
								<div style=margin-bottom:10px; class=bold># ${j} (${app.products[i][j].data.length} item)</div>
								<div class=card style=border-radius:10px;background:white;overflow:hidden;>
									<div style="display:flex;padding:20px;gap:20px;background:#303f9f;border-bottom:1px solid gainsboro;font-weight:bold;color:white;">
										<div style=width:50%;overflow:hidden;white-space:nowrap;>Produk</div>
										<div style=width:40%;overflow:hidden;white-space:nowrap;>Harga</div>
										<div style=width:10%;overflow:hidden;white-space:nowrap;>Status</div>
									</div>
								</div>
							`,
							onadded(){
								this.card = this.find('.card');
								app.products[i][j].data.forEach((data,x)=>{
									this.card.addChild(makeElement('div',{
										style:`display:flex;padding:20px;gap:20px;${app.products[i][j].data.length > 1 ? x < app.products[i][j].data.length - 1 ? 'border-bottom:1px solid gainsboro;' : '' : ''}`,
										innerHTML:`
											<div style=width:50%;overflow:hidden;white-space:nowrap;>${data.product_name}</div>
											<div style=width:40%;overflow:hidden;white-space:nowrap;>Rp ${getPrice(data.price)}</div>
											<div style=width:10%;overflow:hidden;white-space:nowrap;>${(data.seller_product_status && data.buyer_product_status)?'On':'Off'}</div>
										`
									}))
								})
							}
						}))
					}
				}
			}
		})
	},
	profilePage(){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				height:100%;
				background:#f5f5f9;
				overflow:auto;
			`,
			innerHTML:`
				<div class="card bold" style="padding:20px;background:white;border-radius:0 0 10px 10px;position:sticky;top:0;text-align:center;">Profile</div>
				<div style=padding:20px;margin-top:10px;>
					<div style=display:flex;gap:10px;align-items:center;flex-direction:column;>
						<div style=display:flex;align-items:center;>
							<img src=https://vip-reseller.co.id/library/assets/images/profile/avatar.png width=128>
						</div>
						<div style=display:flex;flex-direction:column;gap:5px;align-items:center;width:100%;>
							<div>Gemasajaa</div>
							<div style="
								font-size: 11px;
						    background: #303f9f;
						    color: white;
						    padding: 5px;
						    text-align: center;
						    border-radius: 10px;
							">Active</div>
						</div>
					</div>
					<div class=card style="padding:10px 20px;background:#303f9f;margin-top:30px;border-radius:10px;color:white;display:flex;align-items:center;justify-content:space-between;">
						<div style=display:flex;flex-direction:column;gap:5px;>
							<div>Saldo</div>
							<div style=font-size:11px;display:flex;align-items:center;>Rp 10.000</div>
						</div>
						<div style=display:flex;align-items:center;>
							<img src="https://v3.kiosmoba.com/vendor/assets/img/icons/unicons/add.png" width=24 style=cursor:pointer;>
						</div>
					</div>
					<div style=margin-top:30px;display:flex;gap:10px;flex-direction:column;>
						<div class=card style=background:white;border-radius:8px;padding:20px;display:flex;justify-content:space-between;>
							<div>Saldo Qris</div>
							<div style=font-size:11px;display:flex;align-items:center;>Rp 20.000</div>
						</div>
						<div class=card style=background:white;border-radius:8px;padding:20px;display:flex;justify-content:space-between;>
							<div>Riwayat Transaksi</div>
							<div style=display:flex;align-items:center;cursor:pointer;>
								<img src=https://v3.kiosmoba.com/vendor/assets/img/icons/unicons/arrow-small-right.png width=24>
							</div>
						</div>
						<div class=card style=background:white;border-radius:8px;padding:20px;display:flex;justify-content:space-between;>
							<div>Riwayat Topup</div>
							<div style=display:flex;align-items:center;cursor:pointer;>
								<img src=https://v3.kiosmoba.com/vendor/assets/img/icons/unicons/arrow-small-right.png width=24>
							</div>
						</div>
						<div class=card style=background:white;border-radius:8px;padding:20px;display:flex;justify-content:space-between;>
							<div>Pengaturan Pin</div>
							<div style=display:flex;align-items:center;cursor:pointer;>
								<img src=https://v3.kiosmoba.com/vendor/assets/img/icons/unicons/arrow-small-right.png width=24>
							</div>
						</div>
						<div class=card style=background:white;border-radius:8px;padding:20px;display:flex;justify-content:space-between;>
							<div>Reset Password</div>
							<div style=display:flex;align-items:center;cursor:pointer;>
								<img src=https://v3.kiosmoba.com/vendor/assets/img/icons/unicons/arrow-small-right.png width=24>
							</div>
						</div>
					</div>
					<div class=card style=background:white;margin-top:40px;border-radius:8px;display:flex;flex-direction:column;>
						<div style="padding:20px 20px;border-bottom:1px solid gainsboro;">
							<div style=margin-bottom:5px;>Email</div>
							<div style=font-size:11px;>Gemasajaa@gmail.com</div>
						</div>
						<div style="padding:20px 20px;border-bottom:1px solid gainsboro;">
							<div style=margin-bottom:5px;>Hp</div>
							<div style=font-size:11px;>082289582776</div>
						</div>
						<div style="padding:20px 20px;border-bottom:1px solid gainsboro;">
							<div style=margin-bottom:5px;>Bergabung Pada</div>
							<div style=font-size:11px;>12/02/2024</div>
						</div>
					</div>
					<div class=goldbutton style="margin-bottom:150px;margin-top:30px;">Logout</div>
				</div>
			`,
			onadded(){
				// this.define();
				// this.initPasswordMechanism();
				// this.lupaPassInit();
			},
			define(){
				this.passparent = this.find('#passwordmechanism');
				this.lupapass = this.find('#lupapass');
			},
			initPasswordMechanism(){
				const divs = this.passparent.findall('div');
				const inputs = this.passparent.findall('input');
				this.passparent.findall('img').forEach(img=>{
					img.onclick = ()=>{
						const cmd = img.id.split('_');
						divs[Number(cmd[0])].hide();
						divs[Number(cmd[1])].show('flex');
						divs[Number(cmd[1])].find('input').focus();
					}
				})
				inputs.forEach((input)=>{
					input.oninput = ()=>{
						inputs[Number(input.id)].value = input.value;
					}
				})
			},
			lupaPassInit(){
				this.lupapass.onclick = ()=>{
					app.openLupaPass();
				}
			}
		})
	},
	topupPage(){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				height:100%;
				background:#f5f5f9;
			`,
			innerHTML:`
				<div style="
					background:white;
					padding:20px;
					border-radius:0.5rem;
					margin-top:20px;
					background-clip: padding-box;
    			box-shadow: 0 2px 6px 0 rgba(67, 89, 113, 0.12);
				">
					<div style="
						text-align: center;
				    opacity: 1;
				    transition: opacity 0.15s ease-in-out;
				    color: #697a8d !important;
				    font-weight: 900 !important;
				    margin-bottom: 30px;
					">New Member</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 10px;
				    color:#566a7f;
					">
						<div>Nama Lengkap</div>
						<div style=display:flex;>
							<input class=formc placeholder="Masukan Nama Anda...">
						</div>
					</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 10px;
				    color:#566a7f;
					">
						<div>Email Atau Username</div>
						<div style=display:flex;>
							<input class=formc placeholder="Masukan Email Anda...">
						</div>
					</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 10px;
				    color:#566a7f;
					">
						<div>Nomor Whatsapp</div>
						<div style=display:flex;align-items:center;>
							<input type=number class=formc placeholder="Masukan No Whatsapp Anda..." style="
								border-radius:8px 0 0 8px;
							">
							<div style="
								color: #fff;
						    background-color: #303f9f !important;
						    border-color: #696cff;
						    box-shadow: 0 0.125rem 0.25rem 0 rgba(105, 108, 255, 0.4);
						    white-space:nowrap;
						    padding:9px;
						    border-radius:0 8px 8px 0;
						    cursor:pointer;
							">Kirim Otp</div>
						</div>
					</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 10px;
				    color:#566a7f;
					">
						<div>Kode Otp</div>
						<div style=display:flex;>
							<input type=number class=formc placeholder="Masukan Kode Otp...">
						</div>
					</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 20px;
				    color:#566a7f;
					">
						<div>Password</div>
						<div id=passwordmechanism>
							<div style=display:flex;gap:10px;>
								<input type=password class=formc placeholder="Masukan Password Anda..." id=1>
								<img src=./more/media/hide.png style="
									object-fit:contain;
									cursor:pointer;
								" id=0_1>
							</div>
							<div style=display:flex;gap:10px;display:none;>
								<input class=formc placeholder="Masukan Password Anda..." id=0>
								<img src=./more/media/show.png style="
									object-fit:contain;
									cursor:pointer;
									width:24px;
								" id=1_0>
							</div>
						</div>
					</div>
					<div style="
						padding: 10px;
				    background: #303f9f !important;
				    color: white;
				    border-radius: 0.375rem;
				    text-align: center;
				    /* font-weight: 400; */
				    font-size: 0.9375rem;
				    font-weight: bold;
				    cursor: pointer;
				    border: 1px solid #696cff;
					">Daftar Sekarang</div>
				</div>
			`,
			onadded(){
				this.define();
				this.initPasswordMechanism();
			},
			define(){
				this.passparent = this.find('#passwordmechanism');
			},
			initPasswordMechanism(){
				const divs = this.passparent.findall('div');
				const inputs = this.passparent.findall('input');
				this.passparent.findall('img').forEach(img=>{
					img.onclick = ()=>{
						const cmd = img.id.split('_');
						divs[Number(cmd[0])].hide();
						divs[Number(cmd[1])].show('flex');
						divs[Number(cmd[1])].find('input').focus();
					}
				})
				inputs.forEach((input)=>{
					input.oninput = ()=>{
						inputs[Number(input.id)].value = input.value;
					}
				})
			}
		})
	},
	transferPage(){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				height:100%;
				background:#f5f5f9;
			`,
			innerHTML:`
				<div style="
					background:white;
					padding:20px;
					border-radius:0.5rem;
					margin-top:20px;
					background-clip: padding-box;
    			box-shadow: 0 2px 6px 0 rgba(67, 89, 113, 0.12);
				">
					<div style="
						text-align: center;
				    opacity: 1;
				    transition: opacity 0.15s ease-in-out;
				    color: #697a8d !important;
				    font-weight: 900 !important;
				    margin-bottom: 30px;
					">New Member</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 10px;
				    color:#566a7f;
					">
						<div>Nama Lengkap</div>
						<div style=display:flex;>
							<input class=formc placeholder="Masukan Nama Anda...">
						</div>
					</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 10px;
				    color:#566a7f;
					">
						<div>Email Atau Username</div>
						<div style=display:flex;>
							<input class=formc placeholder="Masukan Email Anda...">
						</div>
					</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 10px;
				    color:#566a7f;
					">
						<div>Nomor Whatsapp</div>
						<div style=display:flex;align-items:center;>
							<input type=number class=formc placeholder="Masukan No Whatsapp Anda..." style="
								border-radius:8px 0 0 8px;
							">
							<div style="
								color: #fff;
						    background-color: #303f9f !important;
						    border-color: #696cff;
						    box-shadow: 0 0.125rem 0.25rem 0 rgba(105, 108, 255, 0.4);
						    white-space:nowrap;
						    padding:9px;
						    border-radius:0 8px 8px 0;
						    cursor:pointer;
							">Kirim Otp</div>
						</div>
					</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 10px;
				    color:#566a7f;
					">
						<div>Kode Otp</div>
						<div style=display:flex;>
							<input type=number class=formc placeholder="Masukan Kode Otp...">
						</div>
					</div>
					<div style="
						display: flex;
				    flex-direction: column;
				    gap: 10px;
				    margin-bottom: 20px;
				    color:#566a7f;
					">
						<div>Password</div>
						<div id=passwordmechanism>
							<div style=display:flex;gap:10px;>
								<input type=password class=formc placeholder="Masukan Password Anda..." id=1>
								<img src=./more/media/hide.png style="
									object-fit:contain;
									cursor:pointer;
								" id=0_1>
							</div>
							<div style=display:flex;gap:10px;display:none;>
								<input class=formc placeholder="Masukan Password Anda..." id=0>
								<img src=./more/media/show.png style="
									object-fit:contain;
									cursor:pointer;
									width:24px;
								" id=1_0>
							</div>
						</div>
					</div>
					<div style="
						padding: 10px;
				    background: #303f9f !important;
				    color: white;
				    border-radius: 0.375rem;
				    text-align: center;
				    /* font-weight: 400; */
				    font-size: 0.9375rem;
				    font-weight: bold;
				    cursor: pointer;
				    border: 1px solid #696cff;
					">Daftar Sekarang</div>
				</div>
			`,
			onadded(){
				this.define();
				this.initPasswordMechanism();
			},
			define(){
				this.passparent = this.find('#passwordmechanism');
			},
			initPasswordMechanism(){
				const divs = this.passparent.findall('div');
				const inputs = this.passparent.findall('input');
				this.passparent.findall('img').forEach(img=>{
					img.onclick = ()=>{
						const cmd = img.id.split('_');
						divs[Number(cmd[0])].hide();
						divs[Number(cmd[1])].show('flex');
						divs[Number(cmd[1])].find('input').focus();
					}
				})
				inputs.forEach((input)=>{
					input.oninput = ()=>{
						inputs[Number(input.id)].value = input.value;
					}
				})
			}
		})
	}
}
