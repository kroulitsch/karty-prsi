class Card {
    constructor(suit, value, visible = false) {
        this.suit = suit;
        this.value = value;
        if (suit !== 0) {
            this.image = loadImage("./images/" + suit + "/card_" + suit + "" + value + ".png");
        } else {
            this.image = loadImage("./images/O/card_" + suit + "" + value + ".png");
        }
        this.x = 0;
        this.y = 0;
        this.visible = visible;
    }

    show() {
        if (this.visible) {
            image(this.image, this.x, this.y, this.image.width * 0.6, this.image.height * 0.6);
        } else {
            image(cardback, this.x, this.y, this.image.width * 0.6, this.image.height * 0.6);
        }
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    flip() {
        this.visible = !this.visible;
    }

    clicked() {
        if (mouseX >= this.x - this.image.width * 0.6 / 2 && mouseX <= this.x + this.image.width * 0.6 / 2) {
            if (mouseY >= this.y - this.image.width * 0.6 / 2 && mouseY <= this.y + this.image.height * 0.6 / 2) {
                return true;
            }
        }

        return false;
    }

    use() {
        hand1 = useCard(hand1, getIndex(this, hand1));
    }
}