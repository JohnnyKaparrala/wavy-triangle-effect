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
  constructor(x, y, r, g, b) {
    this.x = Math.round(x);
    this.y = Math.round(y);
    this.r = r;
    this.g = g;
    this.b = b;
  }
}

class Triangulo {
	constructor (ponto1, ponto2, ponto3) {
		this.ponto1 = ponto1;
		this.ponto2 = ponto2;
		this.ponto3 = ponto3;
	}
}

$(document).ready(function () {
	let c = $("#sup")[0];

	c.width = $("#sup").parent().width() * c.width / 100;
	c.height = $("#sup").parent().height() * c.height / 100;
	let ctx = c.getContext("2d");
	let altura = c.scrollHeight;
 	let largura = c.scrollWidth;

 	let pontos;
 	let pontosReferencia;
 	let pontosDestino;
 	let pontosPartida;
 	let triangulos;
 	let percentagens;
 	let raioAlt = 65;

 	init(150);

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

	function init (raio) {
		let tamanho = raio;


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
						//console.log((i+1) + ", " + (j+1));
						triangulos[triCont] = new Triangulo(pontos[i][j], pontos[i][j+1], pontos[i+1][j+1]);
						triCont++;
						triangulos[triCont] = new Triangulo(pontos[i][j], pontos[i+1][j], pontos[i+1][j+1]);
						triCont++;
					}
			}
		}
		randomize(pontos, pontosReferencia, raioAlt);
		passo();
	}

	function passo () {
		for (let i = 0; i < pontos.length; i ++) {
			for (let j = 0; j < pontos[i].length; j ++) {
				if (pontosDestino[i][j] == undefined || pontosDestino[i][j] === null) {
					pontosPartida[i][j] = new Ponto(pontos[i][j].x, pontos[i][j].y);
					pontosDestino[i][j] = gerarNovoPonto(pontosReferencia[i][j], raioAlt);
					percentagens[i][j] = 0;
				}
				else if (percentagens[i][j] >= 100) {
					pontosDestino[i][j] = null;
				}
				else {
					pontos[i][j].x = pontosPartida[i][j].x + (pontosDestino[i][j].x - pontosPartida[i][j].x) * percentagens[i][j]/100;
					pontos[i][j].y = pontosPartida[i][j].y + (pontosDestino[i][j].y - pontosPartida[i][j].y) * percentagens[i][j]/100;
					percentagens[i][j] += Math.random();
				}
			}
		}

		desenharTriangulos(triangulos);
    window.requestAnimationFrame(passo);
	}

	function angulo(pontoC, pontoE) {
	  let d = new Ponto(pontoE.x - pontoC.x, pontoE.y - pontoC.y);
	  let theta = Math.atan2(d.y, d.x); // range [-PI, PI]
	  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
	  //if (theta < 0) theta = 360 + theta; // range [0, 360)
	  return theta;
	}

	function round(v) {
    return (v >= 0 || -1) * Math.round(Math.abs(v));
	}

	function desenharTriangulos (triangulos) {
		let pontosDeCor = new Array();
		pontosDeCor.push (new PontoDeCor (0, 0, 255, 247, 236));
		pontosDeCor.push (new PontoDeCor (largura, altura, 127, 0, 0));
		//pontosDeCor.push (new PontoDeCor (largura/2, altura/2, 200, 30, 40));

		for (let i = 0; i < triangulos.length; i++) {
			// the triangle
			ctx.beginPath();
			ctx.moveTo(triangulos[i].ponto1.x, triangulos[i].ponto1.y);
			ctx.lineTo(triangulos[i].ponto2.x, triangulos[i].ponto2.y);
			ctx.lineTo(triangulos[i].ponto3.x, triangulos[i].ponto3.y);
			ctx.closePath();
			 	
			//calcula qual cor vai ser
			let centroTriangulo = new Ponto ((triangulos[i].ponto1.x + triangulos[i].ponto2.x + triangulos[i].ponto3.x)/3, (triangulos[i].ponto1.y + triangulos[i].ponto2.y + triangulos[i].ponto3.y) /3);
			let totalDist = 0;
			let totalR = 0;
			let totalG = 0;
			let totalB = 0;
			for (let j = 0; j < pontosDeCor.length; j++) {
				let a = pontosDeCor[j].x - centroTriangulo.x;
				let b = pontosDeCor[j].y - centroTriangulo.y;
				let dist = Math.sqrt(a*a + b*b);
				totalDist += dist;
			}

			for (let j = 0; j < pontosDeCor.length; j++) {
				let a = pontosDeCor[j].x - centroTriangulo.x;
				let b = pontosDeCor[j].y - centroTriangulo.y;
				let dist = Math.sqrt(a*a + b*b);
				totalR += (totalDist - dist) * pontosDeCor[j].r;
				totalG += (totalDist - dist) * pontosDeCor[j].g;
				totalB += (totalDist - dist) * pontosDeCor[j].b;
			}
			let r = Math.round (totalR / totalDist);
			let g = Math.round (totalG / totalDist);
			let b = Math.round (totalB / totalDist);


			ctx.lineWidth = 1;
			ctx.strokeStyle = "rgb(" + r + ", " + g + ", " + b + ")";
			ctx.stroke();

			// the fill color
			ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";
			ctx.fill();
		}
	}
})