$(document).ready(function() {
    //global variables(throw the in database)
    var avgSpeed = 40; //(lower value = faster movement)
    var maxSpeed = 20; //(lowe value = faster movement)
    var maxRadius = 250; //(bigger value = bigger range)
    var minRadius = 150; //(min. distance from inner circle)
    var maxDarkness = 40; //(lower value = darker colors)
    var siteName = "EPRA";
    var dynamicCSS = "";
    var mainColor = "#";
    var lighterColor = "#";
    var darkerColor = "#";
    var circlesNum = 0; // numbers of circles on website
    var prefix = ["", "-webkit-", "-moz-","-o-"]; // browsers differentiation
    var initRadius = 100;

    //declaration of browser variables
    var browserHeight = $(window).height();
    var browserWidth = $(window).width();

    //randomize main color of layout
    var colorDrawing = function () {
        for (var i = 0; i < 3; i++) {
            var randomByte = (Math.round(Math.random() * (256 - 2*maxDarkness) + 2*maxDarkness));
            mainColor = mainColor + randomByte.toString(16);
            lighterColor = lighterColor + (randomByte + maxDarkness).toString(16);
            darkerColor = darkerColor + (randomByte - maxDarkness).toString(16);
        }
    };

    //declaration of DB with circles(temporary as a table), later import from mySQL to this tables
    var dataBase = [    //data for circle declaration, not a circle objects!
        ['nazwa1', 1],
        ['nazwa2', 2],
        ['nazwa3', 3],
        ['nazwa4', 3],
        ['nazwa5', 3],
        ['nazwa6', 3],
        ['nazwa7', 3],
        ['nazwa8', 3]
    ];
    circlesNum = dataBase.length;
    var circleNum = circlesNum;

    //deklaracja konstruktora kolek
    function Circle(name, priority) {
        this.name = name;
        this.priority = priority;
        var diameter = 0;
        if (priority == 1) {
            diameter = 75;
        } else {
            if (priority == 2) {
                diameter = 50;
            }
            else {
                diameter = 25;
            }
        }
        this.diameter = diameter;
        this.velocity = Math.round(Math.random() * avgSpeed + maxSpeed); //wylosowanie predkosci z sensownego przedzialu(czas obiegu pelnego okregu wlasciwie)
        initRadius = initRadius + (this.diameter + Math.round(Math.random() * this.diameter)); //wylosowanie promienia(jest w px, ale dobrze by było w procentach szerokości okna przegladarki), wariant 2 - bezkolizyjnie
        this.mov_radius = initRadius;
        /*Losowanie polozenia kulek. Wariant 1.
        this.mov_radius = Math.round(Math.random() * maxRadius + minRadius); //wylosowanie promienia(jest w px, ale dobrze by było w procentach szerokości okna przegladarki)
        */
        var phase = Math.round(Math.random());
        if (phase == 1) {
            phase = 1;
        } else {
            phase = -1;
        }
        this.starting_phase = phase;
        this.color = mainColor; //kolor z palety wylosowanej na poczatku skryptu(jako string)
        this.visib = 1; //widocznosc(w sensie czy wyswietlic)

        //metoda dodajaca kolko
        this.add_circle = function () {
            //dodac styl diva do css
            dynamicCSS = dynamicCSS +
            "  \
            ." + this.name + "{ \
            position: absolute; \
            left: 50%; \
            top: 50%; \
            width: " + this.diameter + "px; \
            height: " + this.diameter + "px; \
            border-radius: 50%; \
            background: " + this.color + "; \
            \
            ";

            for (j = 0; j < 4; j++) {
                dynamicCSS = dynamicCSS + " \
                background-image: " + prefix[j] + "radial-gradient(" + Math.round(this.diameter / 1.5) + "px circle, white, " + this.color + ");";
            }

            for (j = 0; j < 4; j++) {
                dynamicCSS = dynamicCSS + " \
                " + prefix[j] + "animation: myOrbit" + circleNum + " " + this.velocity + "s linear infinite;";
            }

            dynamicCSS = dynamicCSS +"}";

            for (j = 0; j < 4; j++) {
                dynamicCSS = dynamicCSS + "@" + prefix[j] + "keyframes myOrbit" + circleNum + " { \
                from { " + prefix[j] + "transform: rotate(0deg) translateX(" + this.starting_phase*this.mov_radius + "px) rotate(0deg); } \
                to   { " + prefix[j] + "transform: rotate(360deg) translateX(" + this.starting_phase*this.mov_radius + "px) rotate(-360deg); }}";
            }

            //dodac do domu div
            $('#container').append('<div class="' + this.name + '"><a href="/">A</a></div>'); //dodać linki do kolek
        };
    }
    //Wewnetrzne kolo(wielkosci wyrazone w em), docelowo musi byc w % okna przegladarki
    var innerCircle = {
        diam: 7,

        addInnerCircle : function() {
            $('#container').append('<div id="inner_circle"><div id="inner_circle_inner">' + siteName + '</div></div>');
            dynamicCSS = dynamicCSS + //dodanie css kola srodkowego
            "#inner_circle { \
            position: absolute; \
            left:50%; \
            top:50%; \
            width: " + innerCircle.diam + "em; \
            height: " + innerCircle.diam + "em;} \
            #inner_circle_inner { \
            position: relative; \
            left:-50px; \
            top:-50px; \
            width: " + innerCircle.diam + "em; \
            height: " + innerCircle.diam + "em; \
            border-radius: 50%; \
            background: " + darkerColor + "; ";

            for (j = 0; j < 4; j++) {
                dynamicCSS = dynamicCSS + " \
                background-image: " + prefix[j] + "radial-gradient(" + Math.round(innerCircle.diam*0.9) + "em circle, #dddddd, " + darkerColor + ");";
            }

            dynamicCSS = dynamicCSS +
            "text-align: center; \
            vertical-align: middle; \
            line-height: " + innerCircle.diam + "em; \
            }";
        }
    };

    //wybor kolorystyki
    colorDrawing();

    //dodanie kolodu HUD(narazie tylko menu)
    $('#menu').css("background-color", mainColor);

    //wstawienie kola srodkowego
    innerCircle.addInnerCircle();

    //wstawienie pomniejszych kol
    var circles = new Array();
    for (var i = 0; i < circlesNum; i++) {
    circles[i] = new Circle(dataBase[i][0], dataBase[i][1]);
    circles[i].add_circle();
    circleNum--;
    };

    //dodanie CSS wraz z wygenerowanymi keyframesami
    $('head').append('<style>' +
    dynamicCSS +
    '</style>');

    //dodawanie treści strony(z bazy)
    $('.nazwa1').append('dzisiaj robimy ciastka');
});
