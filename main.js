let canvas;
let ctx;
let triplesTable = {};
let hs = [];
let typeSel;

window.onload = function() {
    canvas = document.getElementById('c');
    ctx = canvas.getContext('2d');
    computeTriples();

    let btn = document.getElementById('gen-btn');
    btn.onclick = generate;

    typeSel = document.getElementById('type-sel');
    typeSel.onchange = generate;

    generate();


}

function gcd(a,b) {
    while(b>0) {
        let aa=a;a=b;b=aa%b;
    }
    return a;
}

function computeTriples() {
    const limit = 300;
    for(let n=1; n<limit; n++) {
        for(let m=n+1; m<limit; m+=2) {
            if(gcd(m,n)!=1) continue;
            let a0 = m*m-n*n;
            let b0 = 2*m*n;
            let c0 = m*m+n*n;
            let k = 0;
            while((k+1)*c0<=500) {
                k++;
                let a = a0*k;
                let b = b0*k;
                let c = c0*k;
                // console.log(a,b,c)
                if(100<=b && b<=550) {
                    let t = triplesTable[b];
                    if(t === undefined) {
                        t = triplesTable[b] = [];
                        hs.push(b);
                    }
                    t.push([a,b,c]);
    
                }
            } 
        }
    }
}





function generate() {
    let width = canvas.width = canvas.clientWidth;
    let height = canvas.height = canvas.clientHeight;

    ctx.clearRect(0,0,width,height);

    let ty = typeSel.value;

    let pts;

    for(;;) {
        let h = hs[Math.floor(Math.random()*hs.length)];
        if(h>height-70) continue;
        let t = triplesTable[h];
        if(t.length <2) continue;

        let i = Math.floor(Math.random()*t.length);
        let j = Math.floor(Math.random()*t.length);
        while(i == j) {
            j = (j+1)%t.length;
        }

        let ai = t[i][0];
        let aj = t[j][0];
        if(ty == "2") { // rettangolo
            if(Math.random()>0.5) aj = 0;
            else ai = 0;
        } else if(ty == "1") { // isoscele
            ai = aj;
        }
        
        let wmin = Math.floor(100 + ai + aj);
        let wmax = Math.floor(width - 80);
        if(wmin > wmax) continue;
        
        let w = wmin + Math.floor(Math.random()*(wmax-wmin));

        let y0 = (height - h)/2;
        let y1 = y0 + h;
    
        let x0 = (width - w)/2;
        let x1 = x0 + w;

        pts = [
            x0 + ai, y0,
            x1-aj, y0,
            x1, y1,
            x0, y1];
    
        console.log(w-ai-aj,w, "h=",h, t[i][2], t[j][2]);
        break;
    }
    
    
    ctx.beginPath();
    ctx.moveTo(pts[6],pts[7]);
    for(let i=0; i<8; i+=2) ctx.lineTo(pts[i],pts[i+1]);

    ctx.strokeStyle = "black";
    ctx.stroke();
    
    for(let i=0; i<4; i++) {
        let x0 = pts[i*2];
        let y0 = pts[i*2+1];
        let i1 = (i+1)%4;
        let x1 = pts[i1*2];
        let y1 = pts[i1*2+1];
        let xm = (x0+x1)*0.5;
        let ym = (y0+y1)*0.5;
        let dx = x1-x0;
        let dy = y1-y0;
        let dist = Math.sqrt(dx*dx+dy*dy);
        let sc = 20.0/dist;
        let px = xm + sc * dy;
        let py = ym - sc * dx;
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        ctx.fillText(Math.floor(0.5+dist), px,py);        
    }
    
}