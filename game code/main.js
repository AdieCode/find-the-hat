const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

function placeHole(){
    let num = Math.random();

    if (num > 0.5){
        return true
    } else {
        return false
    }
}

function totalInArray(list, symbol){
    let count = 0;
    list.forEach(item => {
        if (item === symbol){
            count++
        }
    })
    return count
}

function placeHoles(field, holeAmount){
    let placed = 0;
    let posX = 0;
    let posY = 0;
    let maxAmountPerLine = Math.floor(field[0].length/2);
    newField = field;
    while (placed < holeAmount){

        posY = 0
        posX = 0

        newField.forEach(line => {
            line.forEach(prop => {
                if (placeHole() && prop !== 'O' && placed <= holeAmount && totalInArray(line,'o') < maxAmountPerLine){
                    placed++
                    newField[posY][posX] = hole
                }
                posX++  
            })
            posY++
            posX = 0 
        })
    }
    return newField
}

function placeHat(field,height,width){
    randomY = Math.floor(Math.random()*height);
    randomX = Math.floor(Math.random()*width);

    newField = field;
    newField[randomY][randomX] = hat;
    return newField
}

class Field {
    constructor(matrix){
     this._matrix = matrix; // Corrected assignment
     this._yPos = 0;
     this._xPos = 0;
    }

    set matrix(newMatrix){
        this._matrix = newMatrix;
    }

    resetPos(){
        this._yPos = 0;
        this._xPos = 0;
    }

    print(){
      this._matrix.forEach(line => {
        console.log(line.join(''))
      })
    }

    static generateField(height, width, percentage ){

        let field = []
        const holeAmount = (height*width)*percentage;
        
        for (let i = 0; i < height; i++) {
            field.push([])
            for (let j = 0; j < width; j++) {
                field[i].push(fieldCharacter)
            }
        }
        let newField = placeHoles(field, holeAmount);
        newField = placeHat(newField,height,width);
        newField[0][0] = pathCharacter;

        return newField
    }

    movePathCharacter(direction){
        let isHole = false;
        let isOffField = false;
        let didWin = false
        switch(direction){
            case 'w':
                this._yPos--
                return this.moveChecker()

            case 's':
                this._yPos++
                return this.moveChecker()
                
            case 'a':
                this._xPos--
                return this.moveChecker()
                
            case 'd':
                this._xPos++
                return this.moveChecker()
    
            default:
                break;
        } 
    }

    checkInBounds(){
        const height = this._matrix.length;
        const width = this._matrix[0].length;
        if(this._yPos >= 0 && this._yPos < height && this._xPos >= 0 && this._xPos < width){
            return false
        } else {
            prompt("You fell of the field!");
            return true
        }
    }

    checkForHole(){
        let symbol = this._matrix[this._yPos][this._xPos];
        if (symbol === hole){
            prompt("You fell into a hole!");
            return true
        }
        return false
    }

    checkIfWon(){
        let symbol = this._matrix[this._yPos][this._xPos];
        if (symbol === hat){
            prompt("You found the hat :) !!!");
            return true
        }
        return false
    }
    
    moveChecker(){
        let isHole = false;
        let didWin = false
        let isOffField = this.checkInBounds()

        if (!isOffField){
            isHole = this.checkForHole()
            didWin = this.checkIfWon()
            this._matrix[this._yPos][this._xPos] = pathCharacter
        }
        return isHole || isOffField || didWin
    }
}

const myField = new Field(Field.generateField(12,19,0.4))
myField.print()

let running = true;
while (running) {
    const move = prompt('Enter your move (up="w", down="s", left="a", right="d" |  "q" to quit): ');
    console.clear()
    let death = myField.movePathCharacter(move);
    
    if (move === 'q' ) {
        running = false;
    } 
    
    if (death){
        myField.matrix = Field.generateField(12,19,0.3);
        myField.resetPos()
    }
    console.clear()
    myField.print();
}