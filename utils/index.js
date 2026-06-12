const utils = {
	// 换算距离
	changeNumber: (number) => {
		let data = Number(number)
		if (data >= 1000000) {
			data = data / 1000000 + "m"
		} else if (data >= 1000) {
			data = data / 1000 + "k"
		}
		return data
	},

	lastTime: 0,
	// 节流函数实现
	throttle: function(func, delay) {
		return function(...args) {
			const currentTime = new Date().getTime();
			if (currentTime - utils.lastTime > 20000) {
				utils.lastTime = 0
			}
			if (currentTime - utils.lastTime >= delay) {
				func.apply(this, args);
				utils.lastTime = currentTime;
			}
		};
	},

	// 格式化数字
	formatNumberWithCommas: (input) => {
		if (!input) {
			return
		}
		// 先将输入转换成字符串
		const numberString = input.toString();
		// 使用正则表达式来匹配数字
		const matches = numberString.match(/^(-?\d+)(?:\.(\d+))?$/);
		// 如果匹配失败，返回原始输入，因为它不是一个数字
		if (!matches) {
			return input;
		}
		// 提取整数部分
		let integerPart = matches[1];
		// 检查是否为负数
		const isNegative = integerPart.startsWith('-');
		// 如果是负数，去除负号
		if (isNegative) {
			integerPart = integerPart.slice(1);
		}
		// 如果存在小数部分，提取并截取为两位小数，否则设置小数部分为 '00'
		const decimalPart = matches[2] ? `.${matches[2]}` : '';
		// 添加逗号
		const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '');
		// 构建最终格式化后的数字字符串，包括可能的负号
		const formattedNumber = (isNegative ? '-' : '') + formattedInteger + decimalPart;
		// 返回结果
		return formattedNumber;
	},

	// 邮箱加密
	hideEmail: (email) => {
		if (!email) {
			return
		}
		// 获取@符号的位置
		var atIndex = email.indexOf('@');
		// 如果邮箱地址中没有@符号，直接返回原始邮箱地址
		if (atIndex === -1) {
			return email;
		}
		// 截取@符号前后的字符串
		var beforeAt = email.substring(0, atIndex);
		var afterAt = email.substring(atIndex);
		// 如果截取的字符串长度小于等于6，则只显示前3位字符
		if (beforeAt.length <= 6) {
			return beforeAt.substring(0, 2) + '***' + afterAt;
		} else {
			// 否则，只显示前6位和后6位字符
			return beforeAt.substring(0, 2) + '***' + beforeAt.substring(beforeAt.length - 2) + afterAt;
		}
	},

	// 号码加密
	hidePhone: (phoneNumber) => {
		if (!phoneNumber) {
			return
		}
		// 使用正则表达式匹配手机号的中间部分，并替换为****
		var regex;
		if (phoneNumber.length >= 7 && phoneNumber.length <= 11) {
			regex = new RegExp('(\\d{3})\\d{' + (phoneNumber.length - 7) + '}(\\d{4})');
		} else {
			// 不是合法的手机号长度，直接返回原始字符串
			return phoneNumber;
		}
		var hiddenPart = phoneNumber.replace(regex, '$1***$2');
		return hiddenPart;
	},

	// 页面跳转
	toPage: (pageUrl) => {
		// uni.navigateTo({
		// 	url: pageUrl
		// })
		uni.navigateTo({
			url: pageUrl,
			fail: res => {
				uni.switchTab({
					url: pageUrl
				})
			}
		});
	},

	// 跳转外部链接
	toWeb(url) {
		// #ifdef APP
		plus.runtime.openURL(url)
		// #endif
		// #ifdef H5
		window.open(url)
		// #endif
	},

	// 验证中文
	containsChinese(str) {
		var blo = /[\u4e00-\u9fff]/.test(str.detail.value)
		return blo
	},

	// 验证身份证号
	isValidID(str) {
		let blo = /^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[\dXx]$/.test(str.detail
			.value)
		return blo
	},
}


export default utils