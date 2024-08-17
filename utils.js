// const utils = {
// 	sp: (int) => {
// 		int = int.toString();
// 		return int.split('').reverse().join('').match(/[0-9]{1,3}/g).join('.').split('').reverse().join('');
// 	},
// 	rn: (int, fixed) => {
// 		if (int === null) return null;
// 		if (int === 0) return '0';
// 		fixed = (!fixed || fixed < 0) ? 0 : fixed;
// 		let b = (int).toPrecision(2).split('e'),
// 			k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3),
// 			c = k < 1 ? int.toFixed(0 + fixed) : (int / Math.pow(10, k * 3) ).toFixed(1 + fixed),
// 			d = c < 0 ? c : Math.abs(c),
// 			e = d + ['', '???', '???', '????', '????'][k];

// 			e = e.replace(/e/g, '');
// 			e = e.replace(/\+/g, '');
// 			e = e.replace(/Infinity/g, '??????');

// 		return e;
// 	},
// 	gi: (int) => {
// 		int = int.toString();

// 		let text = ``;
// 		for (let i = 0; i < int.length; i++)
// 		{
// 			text += `${int[i]}&#8419;`;
// 		}

// 		return text;
// 	},
// 	decl: (n, titles) => { return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2] },
// 	random: (x, y) => {
// 		return y ? Math.round(Math.random() * (y - x)) + x : Math.round(Math.random() * x);
// 	},

// 	pick: (array) => {
// 		return array[utils.random(array.length - 1)];
// 	}
// }
// module.exports = {
// 		sp: (int) => {
// 		int = int.toString();
// 		return int.split('').reverse().join('').match(/[0-9]{1,3}/g).join('.').split('').reverse().join('');
// 	},
// 	rn: (int, fixed) => {
// 		if (int === null) return null;
// 		if (int === 0) return '0';
// 		fixed = (!fixed || fixed < 0) ? 0 : fixed;
// 		let b = (int).toPrecision(2).split('e'),
// 			k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3),
// 			c = k < 1 ? int.toFixed(0 + fixed) : (int / Math.pow(10, k * 3) ).toFixed(1 + fixed),
// 			d = c < 0 ? c : Math.abs(c),
// 			e = d + ['', '???', '???', '????', '????'][k];

// 			e = e.replace(/e/g, '');
// 			e = e.replace(/\+/g, '');
// 			e = e.replace(/Infinity/g, '??????');

// 		return e;
// 	},
// 	str_rand: (num) => {
//     let result       = '';
//     let words        = '01234567890123456789qwertyuiopasdfghjklzxcvbnm#@!';
//     let max_position = words.length - 1;

//     for(let i = 0; i < num; ++i) {
//       let position = Math.floor( Math.random() * max_position );
//       result += words.substring(position, position + 1);
//     }

//     return result;
//   },
// 	gi: (int) => {
// 		int = int.toString();

// 		let text = ``;
// 		for (let i = 0; i < int.length; i++)
// 		{
// 			text += `${int[i]}&#8419;`;
// 		}

// 		return text;
// 	},
// 	decl: (n, titles) => { return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2] },
//   split:function( number, decimals, dec_point, thousands_sep ) {
// 		var i, j, kw, kd, km;
// 		if( isNaN(decimals = Math.abs(decimals)) ){
// 			decimals = 0;
// 		}
// 		if( dec_point == undefined ){
// 			dec_point = ",";
// 		}
// 		if( thousands_sep == undefined ){
// 			thousands_sep = " ";
// 		}

// 		i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

// 		if( (j = i.length) > 3 ){
// 			j = j % 3;
// 		} else{
// 			j = 0;
// 		}

// 		km = (j ? i.substr(0, j) + thousands_sep : "");
// 		kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
// 		kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");
// 		return km + kw + kd;
// 	},
// 	  	random: (x, y) => {
// 		return y ? Math.round(Math.random() * (y - x)) + x : Math.round(Math.random() * x);
// 	},
// 	  pick: (array) => {
// 		return array[utils.random(array.length - 1)];
// 	},
//   unixStampLeft:function(stamp) {
// 		let s = stamp % 60;
// 		stamp = ( stamp - s ) / 60;

// 		let m = stamp % 60;
// 		stamp = ( stamp - m ) / 60;

// 		let	h = ( stamp ) % 24;
// 		let	d = ( stamp - h ) / 24;

// 		let text = ``;

// 		if(d > 0) text += Math.floor(d) + " д. ";
// 		if(h > 0) text += Math.floor(h) + " ч. ";
// 		if(m > 0) text += Math.floor(m) + " мин. ";
// 		if(s > 0) text += Math.floor(s) + " с.";

// 		return text;
// 	},
// 	unixStampLeftMassiv:function(stamp) {
// 		let s = stamp % 60;
// 		stamp = ( stamp - s ) / 60;

// 		let m = stamp % 60;
// 		stamp = ( stamp - m ) / 60;

// 		let	h = ( stamp ) % 24;
// 		let	d = ( stamp - h ) / 24;

// 		return [(d > 0 ? Math.floor(d):0), (h > 0 ? Math.floor(h):0), (m > 0 ? Math.floor(m):0), (s > 0 ? Math.floor(s):0)];
// 	},
// }