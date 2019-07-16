# bhom.github.io
Github pages repo for Buildings and Habitats object Model
The website uses git-pages and relies on Jekyll static website builder.


## Install the website

1. Install a Ruby develoment environment from:
https://github.com/oneclick/rubyinstaller2/releases/download/rubyinstaller-2.5.3-1/rubyinstaller-devkit-2.5.3-1-x64.exe


1. Run a Find and see if there is any `Gemfile.lock` in the folder. In case there is, delete it. 
   
   (This step is needed because of [this]( https://stackoverflow.com/questions/47026174/find-spec-for-exe-cant-find-gem-bundler-0-a-gemgemnotfoundexception).)


1. Open a **NEW** cmd prompt, to make sure that the updates on the %PATH% environment variable are effective.

1. Run:
   ```
   gem install jekyll bundler
   ```
   
   This should install both [Bundler](https://bundler.io/) (a Ruby package manager) and [Jekyll](https://jekyllrb.com/) (a Ruby package, here used to spawn a localhost).
   
   If you incur in any trouble during this step, try installing the two tools separately, running first `gem install bundler` and then `gem install jekyll`.

This should be enough for the installation.

For more info on how to install Jekyll, [check its docs](https://jekyllrb.com/docs/).


## Launch the website on localhost
1. Open a cmd in the location of this markdown text file (the root of this cloned repo).
   
   In Windows, you can do that by going in this cloned repo, keep Shift pressed, then right click and select `Open command prompt here`.

2. Run:
   ```
   bundler exec jekyll serve --open-url --force_polling
   ```
   The website will be spawned at the address http://localhost:4000.
   `--open-url` should automatically open the website in your default browser;
   `--force_polling` forces watch to use polling, to recognise and update code changes.
    
   If 2. didn't open automatically a browser windows, navigate to http://localhost:4000.

3. To be sure that the website has been refreshed, use Force Refresh instead of a simple refresh to [bypass the browser cache](https://en.wikipedia.org/wiki/Wikipedia:Bypass_your_cache). 
Force Refresh can be done in most browser by pressing `Ctrl+F5`.
