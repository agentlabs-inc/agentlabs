<script lang="ts">
interface IntercomConfig {
	appId: string;
	name: string;
	email: string;
	createdAt: number;
	userId: string;
}

let rawIntercomScriptCode =  `
		(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/htr7qlri';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
 `

export let config: IntercomConfig;

let intercomIdScript = `
	window.intercomSettings = {
		api_base: "https://api-iam.intercom.io",
		app_id: "${config.appId}",
		name: "${config.name}",
		email: "${config.email}",
		created_at: "${config.createdAt}",
		user_id: "${config.userId}",
	};
`

</script>


<svelte:head>
	<script bind:innerHTML={rawIntercomScriptCode} contenteditable="false"></script>
	<script bind:innerHTML={intercomIdScript} contenteditable="false"></script>
</svelte:head>
