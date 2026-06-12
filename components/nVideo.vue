<template>
	<iframe :onload="onloadCode" style="width:100%;height:100%;background: #000;"></iframe>
</template>
<script>
	export default {
		props: {
			src: {}
		},
		data() {
			return {
				onloadCode: ''
			}
		},
		created() {
			this.onloadCode = `this.contentWindow.document.body.innerHTML = '<video style="width:100%;height:100%;position: absolute;top: 0;bottom: 0;right: 0;left: 0;" loop autoplay controls src="${this.src}"></video>';`
		}
	}
</script>
<style lang="scss">
</style>
