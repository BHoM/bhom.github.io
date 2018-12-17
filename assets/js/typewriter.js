var ConvertToWebAddress = function(text){
           
           splitText = text.split('.');
    
            webAddress = 'https://github.com/BuroHappoldEngineering/BHoM/blob/master/BHoM/'+splitText[2]+'/';
    
            if(splitText.length > 4)
                webAddress += splitText[3]+'/';
            webAddress += splitText[splitText.length-1]+'.cs';
            return webAddress;
       }


var TxtType = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) 
    {
        if (i > 10 )
            this.txt = 'BH.oM';
        else
            this.txt = fullTxt.substring(0, this.txt.length - 1);
    } 
    else 
    {
        if (i > 10 )
            this.txt = fullTxt;
        else
            this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    webText = ConvertToWebAddress(fullTxt)
    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
    this.el.href = webText;
    //BHoM/Structure/Elements/Bar.cs

    var that = this;
    var delta = Math.random() * 450 - 50*i; //600 - Math.random() * 700;

    if (this.isDeleting) { delta = 80  - 20*i; }//{ delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) 
    {
        delta = 2000 - 100*i; //this.period;
        if(delta < 100) delta = 100;
        this.isDeleting = true;
    } 
    else if (this.isDeleting && this.txt === 'BH.oM') 
    {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500 - 40*i;
    }

    setTimeout(function() { that.tick(); }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
};