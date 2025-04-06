var dimBloc = 25;
var harta;
var numarLinii = 20;
var numarColoane = 20;
var context;
var sarpe;
var xSarpe;
var ySarpe;
var xViteza;
var yViteza;
var xMar;
var yMar;
var gataJocul;
var timpSchimbareStareJoc;
var intervalSchimbareJoc;
var numeJucator;
var numePredecesorJucator = -1;

window.onload = function()
{
    harta = document.getElementById("harta");
    harta.height = numarLinii  * dimBloc;
    harta.width = numarColoane * dimBloc;
    context = harta.getContext("2d");

    localStorage.setItem('recordAllTime', 0);
    startJoc();
}

function startJoc()
{
    gataJocul = false;
    sarpe = [];
    xSarpe = dimBloc * 5;
    ySarpe = dimBloc * 5;
    xViteza = 0;
    yViteza = 0;
    schimbareMar();
    timpSchimbareStareJoc = 75;
    mecanicaButonJucator();
    document.addEventListener("keydown", schimbareDirectie);
    intervalSchimbareJoc = setInterval(stareJoc, timpSchimbareStareJoc);
}

function mecanicaButonJucator()
{
    const butonJucator = document.getElementById("butonNume").addEventListener("click", citireNumeJucator);
    if (numeJucator == "")
    {
        mecanicaButonJucator();
    }
}
function citireNumeJucator()
{
    numeJucator = document.getElementById("numeJucator").value.trim();
    if (numeJucator == "")
    {
        alert("Te rog introdu numele jucatorului!");
    }
    else
    {
        alert("Bine ai venit, " + numeJucator + "!!!");
        if (numeJucator !== numePredecesorJucator)
        {
            localStorage.setItem(numeJucator, 0);
        }
        numePredecesorJucator = numeJucator;   
    }
    return numeJucator;
}

function stareJoc()
{
    if (gataJocul)
    {
        finalJoc();
        return;
    }

    document.getElementById("tabelaScor").textContent = "Scor live: " + sarpe.length;

    context.fillStyle="#B7E0A6";
    context.fillRect(0, 0, harta.width, harta.height);

    context.fillStyle="#ff0000";
    context.fillRect(xMar, yMar, dimBloc, dimBloc);

    if (xSarpe == xMar && ySarpe == yMar)
    {
        sarpe.push([xMar, yMar]);
        schimbareMar();
    }

    let lungimeSarpe = sarpe.length;
    for (let i = lungimeSarpe - 1; i > 0; i--)
    {
        sarpe[i] = sarpe[i - 1];
    }
    if (lungimeSarpe != 0)
    {
        sarpe[0] = [xSarpe, ySarpe];
    }

    context.fillStyle = "#003319";
    xSarpe += xViteza * dimBloc;
    ySarpe += yViteza * dimBloc;
    context.fillRect(xSarpe, ySarpe, dimBloc, dimBloc);
    for (let i = 0; i < lungimeSarpe; i++)
    {
        context.fillRect(sarpe[i][0], sarpe[i][1], dimBloc, dimBloc);
    }

    if (xSarpe < 0 || xSarpe > (numarColoane - 1) * dimBloc || ySarpe < 0 || ySarpe > (numarLinii - 1) * dimBloc)
    {
        gataJocul = true;
    }

    for (let i = 0; i < lungimeSarpe; i++)
    {
        if (sarpe[i][0] == xSarpe && sarpe[i][1] == ySarpe)
        {
            gataJocul = true;
        }
    }
}

function schimbareDirectie(eveniment)
{
    if (eveniment.code == "ArrowUp")
    {
        if (yViteza == 1)
        {
            gataJocul = true;
        }
        else
        {
            xViteza = 0;
            yViteza = -1;
        }
    }
    else if (eveniment.code == "ArrowDown")
    {
        if (yViteza == -1)
        {
            gataJocul = true;
        }
        else
        {
            xViteza = 0;
            yViteza = 1;
        }
    }
    else if (eveniment.code == "ArrowLeft")
    {
        if (xViteza == 1)
        {
            gataJocul = true;
        }
        else
        {
            xViteza = -1;
            yViteza = 0;
        }
    }
    else if (eveniment.code == "ArrowRight")
    {
        if (xViteza == -1)
        {
            gataJocul = true;
        }
        else
        {
            xViteza = 1;
            yViteza = 0;
        }
    }
}


function schimbareMar()
{
    xMar = dimBloc * Math.floor(Math.random() * numarColoane);
    yMar = dimBloc * Math.floor(Math.random() * numarLinii);
    let lungimeSarpe = sarpe.length;
    for (let i = 0; i < lungimeSarpe; i ++)
    {
        if (xMar == sarpe[i][0] && yMar == sarpe[i][1])
        {
            schimbareMar();
            break;
        }
    }
}

function finalJoc()
{
    clearInterval(intervalSchimbareJoc);
    lungimeSarpe = sarpe.length;
    if (lungimeSarpe > localStorage.getItem(numeJucator))
    {
        localStorage.setItem(numeJucator, lungimeSarpe);
    }
    let textFinalJoc = "";
    textFinalJoc = afisareFinal(textFinalJoc);
    if (confirm(textFinalJoc))
    {
        startJoc();
    }
}

function afisareFinal(textFinalJoc)
{
    let lungimeSarpe = sarpe.length
    if (lungimeSarpe > localStorage.getItem('recordAllTime'))
    {
        localStorage.setItem('recordAllTime', lungimeSarpe);
    }
    textFinalJoc += "Jocul s-a terminat!\n";
    textFinalJoc += "Scorul tau este: " + lungimeSarpe + "\n";
    textFinalJoc += "Record-ul all-time este: " + localStorage.getItem('recordAllTime') + "\n";
    if (numeJucator !== undefined)
    {
        textFinalJoc += "Record-ul personal al jucatorului " + numeJucator + " este: " + localStorage.getItem(numeJucator) + "\n";
    }
    textFinalJoc += "Restart Joc?";

    return textFinalJoc;
}