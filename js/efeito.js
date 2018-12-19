$(document).ready(function () {
	class Ponto {
	  constructor(x, y) {
	    this.x = Math.round(x);
	    this.y = Math.round(y);
	  }

	  pegarAtributos(ponto) {
	    this.x = ponto.x;
	    this.y = ponto.y;
	  }
	}

	class PontoDeCor {
	  constructor(x, y, r, g, b, peso) {
	    this.x = Math.round(x);
	    this.y = Math.round(y);
	    this.r = r;
	    this.g = g;
	    this.b = b;
	    this.peso = peso;
	  }
	}

	class Triangulo {
		constructor (ponto1, ponto2, ponto3) {
			this.ponto1 = ponto1;
			this.ponto2 = ponto2;
			this.ponto3 = ponto3;
		}
	}

	class Effect {
		constructor (pontos, pontosDestino, pontosPartida, pontosReferencia, triangulos, percentagens, raioAlt, cor, indexCorAtual, canvas, ctx, altura, largura) {
			this.pontos = pontos;
			this.pontosDestino = pontosDestino;
			this.pontosPartida = pontosPartida;
			this.pontosReferencia = pontosReferencia;
			this.triangulos = triangulos;
			this.percentagens = percentagens;
			this.raioAlt = raioAlt;
			this.cor = cor;
			this.canvas = canvas;
			this.ctx = ctx;
			this.altura = altura;
			this.largura = largura;
			this.bonus = 5;
			this.indexCorAtual = indexCorAtual;
		}

		init () {
			randomize(this.pontos, this.pontosReferencia, this.raioAlt);
			this.passo();
		}

		passo () {
			for (let i = 0; i < this.pontos.length; i ++) {
				for (let j = 0; j < this.pontos[i].length; j ++) {
					if (this.pontosDestino[i][j] == undefined || this.pontosDestino[i][j] === null) {
						this.pontosPartida[i][j] = new Ponto(this.pontos[i][j].x, this.pontos[i][j].y);
						this.pontosDestino[i][j] = gerarNovoPonto(this.pontosReferencia[i][j], this.raioAlt);
						this.percentagens[i][j] = 0;
					}
					else if (this.percentagens[i][j] >= 100) {
						this.pontosDestino[i][j] = null;
					}
					else {
						this.pontos[i][j].x = this.pontosPartida[i][j].x + (this.pontosDestino[i][j].x - this.pontosPartida[i][j].x) * this.percentagens[i][j]/100;
						this.pontos[i][j].y = this.pontosPartida[i][j].y + (this.pontosDestino[i][j].y - this.pontosPartida[i][j].y) * this.percentagens[i][j]/100;
						this.percentagens[i][j] += Math.random();
					}
				}
			}

			this.desenharTriangulos(this.triangulos);
			if (typeof suaFunc === "function") { 
			    suaFunc(this.ctx);
			}
			window.requestAnimationFrame(this.passo.bind(this));
		}

		desenharTriangulos () {
			let pontosDeCor = new Array();
			pontosDeCor.push (this.cor[0]);
			pontosDeCor.push (this.cor[1]);
			pontosDeCor.push (this.cor[2]);

			for (let i = 0; i < this.triangulos.length; i++) {
				// the triangle
				this.ctx.beginPath();
				this.ctx.moveTo(this.triangulos[i].ponto1.x, this.triangulos[i].ponto1.y);
				this.ctx.lineTo(this.triangulos[i].ponto2.x, this.triangulos[i].ponto2.y);
				this.ctx.lineTo(this.triangulos[i].ponto3.x, this.triangulos[i].ponto3.y);
				this.ctx.closePath();
				 	
				//calcula qual cor vai ser
				let centroTriangulo = new Ponto ((this.triangulos[i].ponto1.x + this.triangulos[i].ponto2.x + this.triangulos[i].ponto3.x)/3, (this.triangulos[i].ponto1.y + this.triangulos[i].ponto2.y + this.triangulos[i].ponto3.y) /3);
				let totalDist = 0;
				let totalR = 0;
				let totalG = 0;
				let totalB = 0;
				for (let j = 0; j < pontosDeCor.length; j++) {
					let a = pontosDeCor[j].x - centroTriangulo.x;
					let b = pontosDeCor[j].y - centroTriangulo.y;
					let dist = Math.pow(a*a + b*b, 0.4);
					totalDist += dist * pontosDeCor[j].peso;
				}

				for (let j = 0; j < pontosDeCor.length; j++) {
					let a = pontosDeCor[j].x - centroTriangulo.x;
					let b = pontosDeCor[j].y - centroTriangulo.y;
					let dist = Math.pow(a*a + b*b, 0.4);
					totalR += dist * pontosDeCor[j].r * pontosDeCor[j].peso;
					totalG += dist * pontosDeCor[j].g * pontosDeCor[j].peso;
					totalB += dist * pontosDeCor[j].b * pontosDeCor[j].peso;
				}
				let r = Math.round (totalR / (totalDist));
				let g = Math.round (totalG / (totalDist));
				let b = Math.round (totalB / (totalDist));


				this.ctx.lineWidth = 1;
				this.ctx.strokeStyle = "rgb(" + r + ", " + g + ", " + b + ")";
				this.ctx.stroke();

				// the fill color
				this.ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";
				this.ctx.fill();
			}
		}
	}

	function randomize (pontos, pontosReferencia, raio) {
		for (let i = 0; i < pontos.length; i++) {
			for (let j = 0; j < pontos[i].length; j++) {
				let angulo = Math.random() * Math.PI * 2;
				let pt_radius_sq = Math.random() * raio * raio;
		    let pt_x = Math.sqrt(pt_radius_sq) * Math.cos(angulo);
		    let pt_y = Math.sqrt(pt_radius_sq) * Math.sin(angulo);
				pontos[i][j].x = Math.round(pt_x + pontosReferencia[i][j].x);
				pontos[i][j].y = Math.round(pt_y + pontosReferencia[i][j].y);
			}
		}
	}

	function gerarNovoPonto (pontoRef, raio) {
		let angulo = Math.random() * Math.PI * 2;
		let pt_radius_sq = Math.random() * raio * raio;
    let pt_x = Math.sqrt(pt_radius_sq) * Math.cos(angulo);
    let pt_y = Math.sqrt(pt_radius_sq) * Math.sin(angulo);
		return new Ponto(Math.round(pontoRef.x + pt_x), Math.round(pontoRef.y + pt_y));
	}

	function angulo(pontoC, pontoE) {
	  let d = new Ponto(pontoE.x - pontoC.x, pontoE.y - pontoC.y);
	  let theta = Math.atan2(d.y, d.x); // range [-PI, PI]
	  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
	  //if (theta < 0) theta = 360 + theta; // range [0, 360)
	  return theta;
	}

	let effects;
	function init () {
		let elementsCanvas = $(".effect");
		let tam = elementsCanvas.length;
		effects = new Array(tam);
		for (let index = 0; index < tam; index++) {
			let c = elementsCanvas[index];

			c.width = $(elementsCanvas[index]).parent().width() * $(c).attr("widthPerc") / 100;
			c.height = $(elementsCanvas[index]).parent().height() * $(c).attr("heightPerc") / 100;
			let ctx = elementsCanvas[index].getContext("2d");
			let altura = c.scrollHeight;
		 	let largura = c.scrollWidth;

		 	let pontos;
		 	let pontosReferencia;
		 	let pontosDestino;
		 	let pontosPartida;
		 	let triangulos;
		 	let percentagens;
		 	let tamanho = $(elementsCanvas[index]).attr("tamanho");


		  pontos = new Array();
		  let bonus = 5;
			for (let i = -bonus; i < largura / tamanho + bonus; i ++) {
				pontos[i+bonus] = new Array();
				for (let j = -bonus; j < altura / tamanho + bonus; j ++) {
					pontos[i+bonus][j+bonus] = new Ponto (Math.round(tamanho * i), Math.round(tamanho * j));
				}
			}

			pontosReferencia = new Array();
			for (let i = -bonus; i < largura / tamanho + bonus; i ++) {
				pontosReferencia[i+bonus] = new Array();
				for (let j = -bonus; j < altura / tamanho + bonus; j ++) {
					pontosReferencia[i+bonus][j+bonus] = new Ponto (tamanho * i, tamanho * j);
				}
			}

			pontosDestino = new Array();
			for (let i = 0; i < pontos.length; i ++) {
				pontosDestino[i] = new Array(Math.ceil(altura / tamanho + bonus));
			}

			pontosPartida = new Array();
			for (let i = 0; i < pontos.length; i ++) {
				pontosPartida[i] = new Array(Math.ceil(altura / tamanho + bonus));
			}

			percentagens = new Array();
			for (let i = -bonus; i < largura / tamanho + bonus; i ++) {
				percentagens[i+bonus] = new Array();
				for (let j = -bonus; j < altura / tamanho + bonus; j ++) {
					percentagens[i+bonus][j+bonus] = 0;
				}
			}

			//comeca a formar os triangulos
			triangulos = new Array();
			let triCont = 0;
			for (let i = 0; i < pontos.length; i++) {
					for (let j = 0; j < pontos[i].length; j++) {
						if (i < pontos.length - 1 && j < pontos[i].length - 1) {
							let num = Math.round (Math.random());
							switch (num) {
								case 0: {
									triangulos[triCont] = new Triangulo(pontos[i][j], pontos[i][j+1], pontos[i+1][j+1]);
									triCont++;
									triangulos[triCont] = new Triangulo(pontos[i][j], pontos[i+1][j], pontos[i+1][j+1]);
									triCont++;
								}
								break;
								case 1: {
									triangulos[triCont] = new Triangulo(pontos[i][j], pontos[i+1][j], pontos[i][j+1]);
									triCont++;
									triangulos[triCont] = new Triangulo(pontos[i][j+1], pontos[i+1][j], pontos[i+1][j+1]);
									triCont++;
								}
								break;
							}
						}
				}
			}

		 	let raioAlt = $(elementsCanvas[index]).attr("raioDistancia");

		 	let cores = new Array();
		 	for (let i = 0; i < 5; i++) {
		 		cores[i] = new Array(3);
		 	}
		 	let perct = .07;
		 	//laranja
		 	cores[0][0] = new PontoDeCor (perct * largura, perct * altura, 227, 26, 28, 1);
		 	cores[0][1] = new PontoDeCor (largura/2, altura/2, 253, 141, 60, .2);
		 	cores[0][2] = new PontoDeCor (largura - perct * largura, altura -perct * altura, 254, 217, 118, 1);
		 	//verde
		 	cores[1][0] = new PontoDeCor (perct * largura, perct * altura, 204, 236, 230, 1);
		 	cores[1][1] = new PontoDeCor (largura/2, altura/2, 102, 194, 164, .3);
		 	cores[1][2] = new PontoDeCor (largura - perct * largura, altura -perct * altura, 35, 139, 69, 1);
		 	//azul
		 	cores[2][0] = new PontoDeCor (perct * largura, perct * altura, 34, 94, 168, 1);
		 	cores[2][1] = new PontoDeCor (largura/2, altura/2, 65, 182, 196, .2);
		 	cores[2][2] = new PontoDeCor (largura - perct * largura, altura -perct * altura, 199, 233, 180, 1);
		 	//rosa
		 	cores[3][0] = new PontoDeCor (perct * largura, perct * altura, 136, 65, 157, 1);
		 	cores[3][1] = new PontoDeCor (largura/2, altura/2, 247, 104, 161, .4);
		 	cores[3][2] = new PontoDeCor (largura - perct * largura, altura -perct * altura, 191, 211, 230, 1);
		 	//amarelo
		 	cores[4][0] = new PontoDeCor (perct * largura, perct * altura, 204, 76, 2, 1);
		 	cores[4][1] = new PontoDeCor (largura/2, altura/2, 254, 153, 41, .1);
		 	cores[4][2] = new PontoDeCor (largura - perct * largura, altura -perct * altura, 254, 227, 145, 1);
			
			let indexCorAtual;
			switch ($(elementsCanvas[index]).attr("cor")) {
				case "laranja": {
					indexCorAtual = 0;
				}break;
				case "verde": {
					indexCorAtual = 1;
				}break;
				case "azul": {
					indexCorAtual = 2;
				}break;
				case "rosa": {
					indexCorAtual = 3;
				}break;
				case "amarelo": {
					indexCorAtual = 4;
				}break;
				default: {
					indexCorAtual = Math.round(Math.random() * (cores.length - 1) );
				}break;
			}

			effects[index] = new Effect(pontos, pontosDestino, pontosPartida, pontosReferencia, triangulos, percentagens, raioAlt, cores[indexCorAtual], indexCorAtual, c, ctx, altura, largura);
			effects[index].init();
		}
	}

	init();

	$(window).resize(function() {
		for (let index = 0; index < effects.length; index++) {

			let c = $(effects[index].canvas);

			c.attr("width", $(c).parent().width() * $(c).attr("widthPerc") / 100);
			c.attr("height", $(c).parent().height() * $(c).attr("heightPerc") / 100);
			effects[index].altura = c.attr("height");
		 	effects[index].largura = c.attr("width");

		 	let tamanho = c.attr("tamanho");

			effects[index].pontos = new Array();
			for (let i = -effects[index].bonus; i < effects[index].largura / tamanho + effects[index].bonus; i ++) {
				effects[index].pontos[i+effects[index].bonus] = new Array();
				for (let j = -effects[index].bonus; j < effects[index].altura / tamanho + effects[index].bonus; j ++) {
					effects[index].pontos[i+effects[index].bonus][j+effects[index].bonus] = new Ponto (Math.round(tamanho * i), Math.round(tamanho * j));
				}
			}

			effects[index].pontosReferencia = new Array();
			for (let i = -effects[index].bonus; i < effects[index].largura / tamanho + effects[index].bonus; i ++) {
				effects[index].pontosReferencia[i+effects[index].bonus] = new Array();
				for (let j = -effects[index].bonus; j < effects[index].altura / tamanho + effects[index].bonus; j ++) {
					effects[index].pontosReferencia[i+effects[index].bonus][j+effects[index].bonus] = new Ponto (tamanho * i, tamanho * j);
				}
			}

			effects[index].pontosDestino = new Array();
			for (let i = 0; i < effects[index].pontos.length; i ++) {
				effects[index].pontosDestino[i] = new Array(Math.ceil(effects[index].altura / tamanho + effects[index].bonus));
			}

			effects[index].pontosPartida = new Array();
			for (let i = 0; i < effects[index].pontos.length; i ++) {
				effects[index].pontosPartida[i] = new Array(Math.ceil(effects[index].altura / tamanho + effects[index].bonus));
			}

			effects[index].percentagens = new Array();
			for (let i = -effects[index].bonus; i < effects[index].largura / tamanho + effects[index].bonus; i ++) {
				effects[index].percentagens[i+effects[index].bonus] = new Array();
				for (let j = -effects[index].bonus; j < effects[index].altura / tamanho + effects[index].bonus; j ++) {
					effects[index].percentagens[i+effects[index].bonus][j+effects[index].bonus] = 0;
				}
			}

			//comeca a formar os triangulos
			effects[index].triangulos = new Array();
			let triCont = 0;
			for (let i = 0; i < effects[index].pontos.length; i++) {
				for (let j = 0; j < effects[index].pontos[i].length; j++) {
					if (i < effects[index].pontos.length - 1 && j < effects[index].pontos[i].length - 1) {
						let num = Math.round (Math.random());
						switch (num) {
							case 0: {
								effects[index].triangulos[triCont] = new Triangulo(effects[index].pontos[i][j], effects[index].pontos[i][j+1], effects[index].pontos[i+1][j+1]);
								triCont++;
								effects[index].triangulos[triCont] = new Triangulo(effects[index].pontos[i][j], effects[index].pontos[i+1][j], effects[index].pontos[i+1][j+1]);
								triCont++;
							}
							break;
							case 1: {
								effects[index].triangulos[triCont] = new Triangulo(effects[index].pontos[i][j], effects[index].pontos[i+1][j], effects[index].pontos[i][j+1]);
								triCont++;
								effects[index].triangulos[triCont] = new Triangulo(effects[index].pontos[i][j+1], effects[index].pontos[i+1][j], effects[index].pontos[i+1][j+1]);
								triCont++;
							}
							break;
						}
					}
				}
			}

			let perct = 0.07;
		 	effects[index].cor[0] = new PontoDeCor (perct * effects[index].largura, perct * effects[index].altura, effects[index].cor[0].r, effects[index].cor[0].g, effects[index].cor[0].b, effects[index].cor[0].peso);
		 	effects[index].cor[1] = new PontoDeCor (effects[index].largura/2, effects[index].altura/2, effects[index].cor[1].r, effects[index].cor[1].g, effects[index].cor[1].b, effects[index].cor[1].peso);
		 	effects[index].cor[2] = new PontoDeCor (effects[index].largura - perct * effects[index].largura, effects[index].altura -perct * effects[index].altura, effects[index].cor[2].r, effects[index].cor[2].g, effects[index].cor[2].b, effects[index].cor[2].peso);

			randomize(effects[index].pontos, effects[index].pontosReferencia, c.attr("raioDistancia"));
		}
	})
})