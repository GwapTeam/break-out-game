phina.globalize();

phina.define("MainScene", {
    superClass: "DisplayScene",
    init: function() {
        this.superInit();
        this.backgroundColor = "black";
        this.blockGroup = DisplayElement().addChildTo(this);

        // パドル表示
        var paddleY = this.gridY.span(14);
        var paddle = Paddle().addChildTo(this).setPosition(this.gridX.center(), paddleY);
        // タッチ移動時
        this.onpointmove = function(e) {
            paddle.setPosition(e.pointer.x , paddleY);
        };
        // タッチ終了時
        this.onpointend = function() {
            if(this.status == "ready") {
                this.ball.vy = -10;
                this.ball.vx = 10;
                this.status = "move";
            }
        };

        // ブロック表示
        for (var y = 2 ; y < 12; y+=0.5) {
            for (var x = 2; x < 15; x+=3) {
                 Block().addChildTo(this.blockGroup).setPosition(this.gridX.span(x), this.gridY.span(y));
            }
        }

        this.ball = Ball().addChildTo(this);
        this.paddle = paddle;
        this.status = "ready";
        this.screenRect = Rect(0, 0, 640, 960);
        this.lifePoint = 2; // 3機
        this.lifeGroup = DisplayElement().addChildTo(this);
        for (var i = 0; i < this.lifePoint; i++) {
            life().addChildTo(this.lifeGroup).setPosition(this.gridX.span(1.5 + i * 2), this.gridY.span(1));
        }
    },

    update: function() {
        var ball = this.ball;
        var paddle = this.paddle;
        var screenRect = this.screenRect;

        // ボール停止時
        if (this.status == "ready") {
            ball.vx = 0;
            ball.vy = 0;
            ball.x = paddle.x;
            ball.bottom = paddle.top;
        // ボール移動時
        } else if (this.status == "move") {
            ball.moveBy(ball.vx, ball.vy);

            // 画面端当たり判定
            if (ball.left < screenRect.left || ball.right > screenRect.right) {
                ball.vx = -ball.vx;
            }
            if (ball.top < screenRect.top) {
                ball.vy = -ball.vy;
            }

            // パドル当たり判定
            if (ball.hitTestElement(paddle)) {
                ball.bottom = paddle.top;
                ball.vy = -ball.vy;
                var dx = ball.x - paddle.x;
                ball.vx = dx / 5;
            }

            // ゲームオーバー判定
            if (ball.top > screenRect.bottom) {
                if (this.lifePoint == 0) {
                    Label({text: 'GAME OVER', fill: 'yellow'})
                        .addChildTo(this)
                        .setPosition(this.gridX.center(), this.gridY.center());
                } else {
                    this.status = "ready";
                    this.lifePoint--;
                    this.lifeGroup.children[this.lifePoint].remove();
                }
            }

            // ブロック当たり判定
            for (var i = 0; i < this.blockGroup.children.length; i++) {
                var block = this.blockGroup.children[i];

                if (ball.hitTestElement(block)) {
                    block.remove();
                    if (ball.top < block.top || ball.bottom > block.bottom) {
                        ball.vy = -ball.vy;
                    } else if (ball.left < block.left || block.right < ball.right) {
                        ball.vx = -ball.vx;
                    }
                }
            }

            // クリア判定
            if (this.blockGroup.children.length == 0) {
                Label({text: 'CLEAR', fill: 'yellow'})
                    .addChildTo(this)
                    .setPosition(this.gridX.center(), this.gridY.center());
                this.status = "ready";
            }
        }
    }
});

phina.define("Paddle", {
    superClass: "RectangleShape",
    init: function() {
        this.superInit({
            width: 100,
            height: 30,
            fill: "white",
        });
    }
});

phina.define("Ball", {
    superClass: "CircleShape",
    init: function() {
        this.superInit({
            radius: 10,
            fill: "white",
        });
    }
});

phina.define("Block",{
    superClass: "RectangleShape",
    init: function() {
        this.superInit({
            width: 40 * 2,
            height: 60 / 2,
            fill: "orange",
        });
    }
});

phina.define("life",{
    superClass: "HeartShape",
    init: function() {
        this.superInit({
            cornerAngle: 60,
        });
    }
});

phina.main(function() {
    var app = GameApp({
        title: "Break Out",
        fps: 30,
    });
    app.run();
});
