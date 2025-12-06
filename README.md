# ChatBDC

*A stupid discord bot for stupid people*

#### Check the deploy directory for k8s manifests.


---
Getting Started

1. Install [Deno](https://deno.com)
2. `deno install`
3. Create .env file in root
4. Add the required variables and values. See config.ts.
5. Add your own `carlQuotes.ts` with stupid quotes from your own favorite carl.
6. `deno run deploy-commands`
    * You'll need to comment out the imports to the any files/modules in the `interactions` directory in your commands before running this or you'll get stuck.  
    * I'll fix it later (maybe, probably not).
5. `deno run dev`

---

While you **CAN** leave the media in the repo itself and use it from there,  
this will make adding files much more annoying if you are running in a container.  
You **WILL** lose any files you add to the running container when it shuts down.   
It will also make your container image massive (depending on how much media you add) and  
can actually cause your pushes to github to get rejected if the files are too large.

I would suggest checking out the suggestions I have made in the `deploy/storage.yaml`.  
Of course you can ignore all of this if you just run the bot on the metal.  
You can also use docker compose and use the host filesystem if you have access. 

"Fun" Fact: If you add files to the share from another machine than the container running the bot  
Deno.Fs will not catch this change and your audio file list won't update. This will effect  
autocomplete and not allow you to play new audio files. Make sure to leverage the `/upload` command  
for adding any audio files. Again, ignore all this if you are on the metal.