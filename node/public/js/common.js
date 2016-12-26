'use strict';
(function () {
    $(document).on('ready',function () {
        var socket = io();
        //validator

        _("#formValidSignUp").init({
            email: "[name=email]",
            password: "[name=password]"
        });

        //navs active 
        var navs = $('.navs');

        navs.children('li').on('click', function () {
            navs.children('li').removeClass('activeLink');
            $(this).addClass('activeLink');
        });

        $('.navs').find('a.stoped-prevent').on('click',function (event) {
            event.preventDefault();
        });

        $('.navs').find('[href="/index"]').click(function () {
            $.ajax({
                url: "/index",
                async: true
            }).done(function (data) {
                $('.mainAllBg').html(data);
            });
        });

        // $('.navs').find('[href="/profile"]').click(function () {
        //     $.ajax({
        //         url: "/profile",
        //         async: true
        //     }).done(function (data) {
        //         $('.mainAllBg').html(data);
        //     });
        // });

        $('.navs').find('[href="/tournaments"]').click(function () {
            $.ajax({
                url: "/tournaments",
                async: true
            }).done(function (data) {
                $('.mainAllBg').html(data);
            });
        });

        $('.navs').find('[href="/statistics"]').click(function () {
            $.ajax({
                url: "/statistics",
                async: true
            }).done(function (data) {
                $('.mainAllBg').html(data);
            });
        });

        $('.navs').find('[href="/rivers"]').click(function () {
            $.ajax({
                url: "/rivers",
                async: true
            }).done(function (data) {
                $('.mainAllBg').html(data);
            });
        });

        if(this.location.pathname == '/game') {
            $('.mainAllBg').css({
                'paddingTop': 0
            })
        }

        if(this.location.pathname == '/profile') {
            $('.navs').children().removeClass('activeLink');
            $('[href="/profile"]').parent().addClass('activeLink');
        }

        $('#formProfile').on('submit', function (event) {
            event.preventDefault();

            $.post("/formProfile", {
                email: $(this).find("[name=email]").val(),
                fio: $(this).find("[name=fio]").val(),
                nick: $(this).find("[name=nick]").val(),
                // password: $(this).find("[name=password]").val(),
                tel: $(this).find("[name=tel]").val()
            }).done( function (data) {
                $('.profile-fio').text(data.local.fio);
                $('.profile-email').text(data.local.email);
                $('.profile-nick').text(data.local.nick);
                $('.profile-tel').text(data.local.tel);
            })
        });

        $('.read-profile-button').on('click', function (event) {
            event.preventDefault();

            $(this).hide();
            $('.inputRead').show();
        });

        $('.post-read-profile').on('click', function () {
            $('.inputRead').hide();
            $('.read-profile-button').show();
        });

//cookie
        function getCookie(name) {
            var matches = document.cookie.match(new RegExp(
                // "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
                name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        }
        var nameUserCookie = getCookie('personId');

        $('.addedMessage').submit(function(){
            socket.emit('chat message', $('.textAdd').val(), nameUserCookie);
            $('.textAdd').val('');
            return false;
        });

        $('.textAdd').on('keydown', function () {
            socket.emit('chat message change', true, nameUserCookie);
        });
        socket.on('typing user', function (nameUserMess) {
            var typingBlock = $('.typingUsers');

            if(typingBlock.css('display') == 'none') {
                typingBlock.text('User: ' + nameUserMess + ' is typing').show();
            } else
            if(typingBlock.css('display') == 'block') {
                setTimeout(function () {
                    typingBlock.fadeOut(300);
                }, 1000)
            }
        });
        
        socket.on('chat message', function(msg,nameUserMess){
            $('#messages').append($('<li>').text(nameUserMess + ': ' + msg));
            return false;
        });




        //>>>>>>>>>>>>>>>>>>ALL POKERS GAMES SCRIPT<<<<<<<<<<<<<<<<<<
        
        //Card deck
        var cardsArr = [
    ['cardsT1',
        ['0 0']
    ],
    ['cardsT2',
        ['-46px 0']
    ],
    ['cardsT3',
        ['-92px 0']
    ],
    ['cardsT4',
        ['-138px 0']
    ],
    ['cardsT5',
        ['-184px 0']
    ],
    ['cardsT6',
        ['-230px 0']
    ],
    ['cardsT7',
        ['-276px 0']
    ],
    ['cardsT8',
        ['-322px 0']
    ],
    ['cardsT9',
        ['-370px 0']
    ],
    ['cardsT10',
        ['-416px 0']
    ],
    ['cardsT11',
        ['-462px 0']
    ],
    ['cardsT12',
        ['-508px 0']
    ],
    ['cardsT13',
        ['-554px 0']
    ],
    ['cardsB1',
        ['0 -67px']
    ],
    ['cardsB2',
        ['-46px -67px']
    ],
    ['cardsB3',
        ['-92px -67px']
    ],
    ['cardsB4',
        ['-138px -67px']
    ],
    ['cardsB5',
        ['-184px -67px']
    ],
    ['cardsB6',
        ['-230px -67px']
    ],
    ['cardsB7',
        ['-276px -67px']
    ],
    ['cardsB8',
        ['-322px -67px']
    ],
    ['cardsB9',
        ['-370px -67px']
    ],
    ['cardsB10',
        ['-416px -67px']
    ],
    ['cardsB11',
        ['-462px -67px']
    ],
    ['cardsB12',
        ['-508px -67px']
    ],
    ['cardsB13',
        ['-554px -67px']
    ],
    ['cardsC1',
        ['0 -134px']
    ],
    ['cardsC2',
        ['-46px -134px']
    ],
    ['cardsC3',
        ['-92px -134px']
    ],
    ['cardsC4',
        ['-138px -134px']
    ],
    ['cardsC5',
        ['-184px -134px']
    ],
    ['cardsC6',
        ['-230px -134px']
    ],
    ['cardsC7',
        ['-276px -134px']
    ],
    ['cardsC8',
        ['-322px -134px']
    ],
    ['cardsC9',
        ['-370px -134px']
    ],
    ['cardsC10',
        ['-416px -134px']
    ],
    ['cardsC11',
        ['-462px -134px']
    ],
    ['cardsC12',
        ['-508px -134px']
    ],
    ['cardsC13',
        ['-554px -134px']
    ],
    ['cardsP1',
        ['0 -200px']
    ],
    ['cardsP2',
        ['-46px -200px']
    ],
    ['cardsP3',
        ['-92px -200px']
    ],
    ['cardsP4',
        ['-138px -200px']
    ],
    ['cardsP5',
        ['-184px -200px']
    ],
    ['cardsP6',
        ['-230px -200px']
    ],
    ['cardsP7',
        ['-276px -200px']
    ],
    ['cardsP8',
        ['-322px -200px']
    ],
    ['cardsP9',
        ['-370px -200px']
    ],
    ['cardsP10',
        ['-416px -200px']
    ],
    ['cardsP11',
        ['-462px -200px']
    ],
    ['cardsP12',
        ['-508px -200px']
    ],
    ['cardsP13',
        ['-554px -200px']
    ]
],
            firstCards = $('.firstCards'),
            secondCards = $('.secondCards'),
            thirdCards = $('.thirdCards'),
            fourthCards = $('.fourthCards'),
            fifthCards = $('.fivethCards');

        $('.rand').on('click', function () {
            dealerDistribution();
            self.rate(firstPlayer.points());
        });

        // Displacement blands
        function blainsDisplacement() {
            var bigBlands = $('.blendsBlocBig'),
                smallBlands = $('.blendsBlocSmall'),
                indexBB = $('.blendsBlocBig').closest('.playersBlockAll').attr('data-position-blands');

            if(indexBB == 1) {
                $('.playersBlockAll').eq(2).find('.plaersCardsOnly').after(bigBlands);
                $('.playersBlockAll').eq(0).find('.plaersCardsOnly').after(smallBlands);
            }
            if(indexBB == 2) {
                $('.playersBlockAll').eq(3).find('.plaersCardsOnly').after(bigBlands);
                $('.playersBlockAll').eq(2).find('.plaersCardsOnly').after(smallBlands);
            }
            if(indexBB == 3) {
                $('.playersBlockAll').eq(1).find('.plaersCardsOnly').after(bigBlands);
                $('.playersBlockAll').eq(3).find('.plaersCardsOnly').after(smallBlands);
            }
            if(indexBB == 4) {
                $('.playersBlockAll').eq(0).find('.plaersCardsOnly').after(bigBlands);
                $('.playersBlockAll').eq(1).find('.plaersCardsOnly').after(smallBlands);
            }
        }

        var self;
        // Players created constructor
        function Players(positionCards,firstCards,secondCards,name) {
            self = this;
            var firstCardsOnly = firstCards;
            var secondCardsOnly = secondCards;
            var pointsPlayer = positionCards;
            this.points = function () {
                return pointsPlayer;
            };
            playersDistribution(positionCards.find('.firstCardsPlayers'),firstCardsOnly);
            playersDistribution(positionCards.find('.secondCardsPlayers'),secondCardsOnly);

        };

        Players.prototype.rate = function (pointsPlayers) {

                console.log(pointsPlayers);

        };

        // Players obtained cards
        function playersDistribution(elem,firstCards) {
            elem.css({
                'background-position':firstCards
            });
        }

        // Created Players
        var firstPlayer = new Players($('.firstPlayersPosition'),randomCards()[0][1],randomCards()[0][1],'pet9');
        var secondPlayer = new Players($('.secondPlayersPosition'),randomCards()[0][1],randomCards()[0][1],'vasi9');
        var thirdPlayer = new Players($('.thirdPlayersPosition'),randomCards()[0][1],randomCards()[0][1]);
        var fourthPlayer = new Players($('.fourthPlayersPosition'),randomCards()[0][1],randomCards()[0][1]);

        // First distribution
        function dealerDistribution() {
            firstCards.css({
                'background-position':randomCards()[0][1]
            });
            secondCards.css({
                'background-position':randomCards()[0][1]
            });
            thirdCards.css({
                'background-position':randomCards()[0][1]
            });
        };

        // Obtaining the fourth card
        function fourthCard() {
            fourthCards.css({
                'background-position':randomCards()[0][1]
            });
        };

        // Obtaining the fifth card
        function fifthCard() {
            fifthCards.css({
                'background-position':randomCards()[0][1]
            });
        };

        // Obtaining random cards
        function randomCards() {
            var randomNumber = getRandomInt(0,cardsArr.length-1),
                randomCard;
                randomCard = cardsArr.splice(randomNumber,1);
            return randomCard;
        };

        // Obtaining random numbers
        function getRandomInt(min, max) {
            var rand = min + Math.random() * (max + 1 - min);
            rand = Math.floor(rand);
            return rand;
        };
    });
})();
