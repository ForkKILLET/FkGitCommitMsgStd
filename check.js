const { format } = require("util")

const L = (...P) => console.log(...P)
L.o = (...P) => process.stdout.write(format(...P))
L.c = s => S.debug && L.o(`\x1B[36m${s}\x1B[0m`)

const S = {
	debug: false,
	debugIndent: 2,
	itemOp: "-x*!^$"	.split(""),
	itemTy: "-?#<>@"	.split(""),
	infoTy: ":!&"		.split(""),

	_: { n: "root", l: -1 },

	T: (N, ...P) => {
		N.l = S._.l + 1
		if (N.d === "~") N.d = N.n
		if (S.debug) {
			S.debugCoded = false
			L.o("\n🚩 " + " ".repeat(S.debugIndent * N.l))
			L.c(S._.l + " ")
			L.o(`${N.n} (${N.d})  `)
		}
		N.f = S._
		S._ = N
		const R = C[N.n](...P)
		S.checker[N.n]?.(S._)
		S._ = S._.f
		return R
	},

	recc: s => {
		L.c(JSON.stringify(s) + "  ")
		return S._.c = s
	},

	lnc: () => S.recc(S.lns.splice(0, 1)[0]),
	get lnh() { return S.lns[0] },
	set lnh(s) { S.lns[0] = s },

	tk: ln => { S.tks = ln.split(" ") },
	tkc: () => S.recc(S.tks.splice(0, 1)[0]),
	get tkh() { return S.tks[0] },

	chc: (n = 1, _s) => S.recc(
		([ _s, S.lnh ] = [ S.lnh.slice(0, n), S.lnh.slice(n) ])[0]
	)
}

const C = {
	none() {},

	lnBrk(_) {
		if (S.lnh !== "" && ! _) throw "should be empty"
		else S.lnc()
	},

	space(n = 1) {
		if (n === "auto") {
			const l = S.lnh.length
			S.lnh = S.lnh.replace(/^ */, "")

			return l - S.lnh.length
		}
		else if (S.chc(n) !== " ".repeat(n)) throw `should be ${n} space(s)`
	},

	url() {
		if (! S.lnc().match(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/))
			throw "should be a URL with http or https protocol"
	},

	root() {
		if (S.debug) {
			L.c(S.msg + "\n")
		}
		[
			{ n: "header", d: "~" },
			{ n: "lnBrk", d: "line break between header and body" },
			{ n: "body", d: "~" }
		].forEach(S.T)
	},

	header() {
		S.tk(S.lnc())

		let desc = false
		while (S.tks.length)
			if (S.T({ n: "descSym", d: "descriptor symbol in the header" }) !== false) desc = true

		if (! desc) throw "should have at least one descriptor symbol"
	},

	descSym() {
		const N = {
			VER: { n: "ver", d: "version" },
			SUM: { n: "none", d: "~" },
			MRG: { n: "sharpId", d: "id of the commit to merge" },
			ISS: { n: "sharpId", d: "id of the issue to fix" }
		} [ S.tkc() ]
		return N ? S.T(N) : false
	},

	sharpId() {
		if (! S.tkc()?.match(/^#\d+$/)) throw "should be '#' followed by a number"
	},

	ver() {
		if (! S.tkc()?.match(/^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:-((?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/))
			throw "should be a SemVer"
	},

	body() {
		while (S.lns.length) {
			S.T({ n: "item", d: "~" }, 0)
			S.T({ n: "lnBrk", d: "optional line break between items" }, true)
		}
	},

	item(l) {
		S.T({ n: "itemOp", d: "operation of the item" })
		S.T({ n: "itemTy", d: "type of the item" })
		S.T({ n: "space", d: "space after type of the item" }, 1)

		S.T({ n: "none", d: "summary of the item" })
		S.lnc()

		let subItem = false
		sub: while (S.lns.length && true) {
			let b = S.T({ n: "space", d: "indent of the item" }, "auto")
			if ((b -= l * 3) < 0) break
			switch (b) {
			case 0:
				break sub
			case 1:
				if (subItem) throw "should be before subitems"
				S.T({ n: "info", d: "inforamtion of the item" })
				break
			case 3:
				S.T({ n: "item", d: "subitem" }, l + 1)
				subItem = true
				break
			default:
				throw "should be inforamtion or subitem, which should be indented by 1 and 3 spaces respectively"
			}
		}
	},

	itemOp() {
		if (! S.itemOp.includes(S.chc())) throw `should be an operation in [${ S.itemOp.join(", ") }]`
	},

	itemTy() {
		const c = S.chc()
		if (! S.itemTy.includes(c)) throw `should be an type in [${ S.itemTy.join(", ") }]`
	},

	info() {
		const c = S.T({ n: "infoTy", d: "type of inforamtion" })
		S.T({ n: "space", d: "space after inforamtion" }, 1)
		switch (c) {
		case "&":
			S.T({ n: "url", d: "url of '&' inforamtion" })
			break
		default:
			S.T({ n: "none", d: "text of inforamtion" })
			S.lnc()
		}
	},

	infoTy() {
		const c = S.chc()
		if (! S.infoTy.includes(c)) throw `should be an type in [${ S.infoTy.join(", ") }]`
		return c
	}
}

const I = (msgs, args) => {
	for (const [ k, v ] of Object.entries(args))
		S[k] = typeof v == "function" ? v(S[k]) : v

	if (S.debug) L("🔎 Debugging is on")

	let fail = 0
	msgs.forEach((msg, i) => {
		S.msg = msg
		S.lns = msg.split("\n")
		try {
			S.T({ n: "root", d: "whole message" })
		}
		catch (e) {
			L((S.debug ? "\n" : "") + `💥 Error at meesage ${i}#, ${S._.n} (${S._.d}): ${e}!`)
			fail ++
		}
	})
	L((fail ? `😅 Only ${ msgs.length - fail }` : (S.debug ? "\n\n" : "") + "🌟 All") + ` of ${ msgs.length } commit msg(s) are OK.`)

	return fail
}

module.exports = { S, C, I }

if (process.env.INPUT_MSGS) {
	const A = require(".gitmsgrc.js")
	const M = JSON.parse(process.env.INPUT_MSGS)
	const F = I(M, A)
	process.exit(F)
}

