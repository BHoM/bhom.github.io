# bhom.github.io
Github pages repo for Buildings and Habitats object Model
The website uses git-pages and relies on Jekyll static website builder.


TO INSTALL THE WEBSITE: (Yes, you need to install some tools to see it)
1. Install a Ruby develoment environment from:
https://github.com/oneclick/rubyinstaller2/releases/download/rubyinstaller-2.5.3-1/rubyinstaller-devkit-2.5.3-1-x64.exe


1. delete the Gemfile.lock file  https://stackoverflow.com/questions/47026174/find-spec-for-exe-cant-find-gem-bundler-0-a-gemgemnotfoundexception 


1. Open a **NEW** cmd to let the updates on the %PATH% variable be effective and run: 
	`gem install jekyll bundler`

This should be enough, but for a detailed guide on how to install Jekyll you can see here:
https://jekyllrb.com/docs/


TO RUN THE WEBSITE:
1. Open a cmd in the location of this markdown text file

2. run:
	`bundler exec jekyll serve`
	The website will be spawned at the port 4000 by default

3. Open your favourite browser (not IE) and navigate to:
	`localhost:4000`


There are two batch files to install and run tghe website if you feel lazy, but I do not recommend that, respectively:
`install-me-first.bat` and `run-me-now.bat`
