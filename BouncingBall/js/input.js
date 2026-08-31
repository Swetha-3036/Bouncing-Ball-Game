export function setupKeyboard(game) {

    document.addEventListener("keydown", event => {

        if (event.key === "ArrowLeft") {
            game.keys.left = true;
        }

        if (event.key === "ArrowRight") {
            game.keys.right = true;
        }

    });


    document.addEventListener("keyup", event => {

        if (event.key === "ArrowLeft") {
            game.keys.left = false;
        }

        if (event.key === "ArrowRight") {
            game.keys.right = false;
        }

    });
}