import Gameboard from './gameboard';
import Ship from './ships';

class Player {
    constructor(name = undefined) {
        this.board = new Gameboard();
        this.myShips = this.board.ships;
        this.myAttacks = Gameboard.boardGenerator();
        this.adversaryName = undefined;
        this.score = 0;

        if (name) {
            this.name = name;
        } else {
            this.nextAttack = { hits: [], queue: [], posibleShips: 0 };
        }
    }

    #adversary = undefined;

    setAdversary(player) {
        if (!(player instanceof Player) || this.adversaryName) {
            return;
        }

        this.#adversary = player;
        this.adversaryName = this.#adversary.name ?? 'AutoPlayer';

        if (!player.adversaryName) {
            player.setAdversary(this);
        }
    }

    placeAllShips() {
        for (const ship of Object.keys(Ship.shipsAndSize)) {
            if (!this.board.shipsInventory.placed.has(ship)) {
                this.board.placeShipRandom(ship);
            }
        }
    }

    attack(col, row) {
        if (col > 9 || row > 9 || this.myAttacks[row][col]) {
            return false;
        }

        const typeOfHit = this.#adversary.board.receiveAttack(col, row);
        this.score = this.#adversary.board.shipsInventory.sank.size;

        this.myAttacks[row][col] = typeOfHit === 'Water' ? '·' : 'X';

        if (typeOfHit === 'Ship' && !this.name) {
            this.#setNextAttack(col, row);
        }

        if (typeOfHit === 'Sunk') {
            if (!this.name) {
                this.nextAttack.posibleShips--;

                if (!this.nextAttack.posibleShips) {
                    this.nextAttack.hits = [];
                    this.nextAttack.queue = [];
                }
            }
        }

        return typeOfHit;
    }

    attackAuto() {
        if (this.name || !this.nextAttack.posibleShips) {
            return this.attackRandom();
        } else {
            return this.#attackQueued();
        }
    }

    attackRandom() {
        const target = this.myAttacks.flatMap((row, rowNumber) => {
            return row
                .map((cell, colNumber) =>
                    !cell ? [rowNumber, colNumber] : null,
                )
                .filter((e) => e);
        });

        const [rRow, rCol] = target[Math.floor(Math.random() * target.length)];

        return this.attack(rCol, rRow);
    }

    #setNextAttack(fromCol, fromRow) {
        const secuence = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1],
        ];

        const attackSecuence = secuence
            .map(([row, col]) => [fromRow + row, fromCol + col])
            .filter(([row, col]) => this.myAttacks[row]?.[col] === false);

        const nextAttack = this.nextAttack;
        nextAttack.hits.push([fromRow, fromCol]);

        if (nextAttack.hits.length === 1) {
            nextAttack.queue = attackSecuence;
            nextAttack.posibleShips++;
            return;
        }

        const isHorizontal = nextAttack.hits[0][1] === nextAttack.hits[1][1];
        const dirIndex = isHorizontal ? 1 : 0;
        const dirValue = nextAttack.hits[0][dirIndex];

        if (nextAttack.hits.length === 2) {
            nextAttack.queue.sort((a) => (a[dirIndex] === dirValue ? -1 : 0));
        }

        if (
            !nextAttack.queue.filter((att) => att[dirIndex] === dirValue).length
        ) {
            console.log('crear sospecha');
        }

        const [inAxis, offAxis] = attackSecuence.reduce(
            ([align, misalign], attack) => {
                attack[dirIndex] === dirValue
                    ? align.push(attack)
                    : misalign.push(attack);
                return [align, misalign];
            },
            [[], []],
        );

        nextAttack.queue.unshift(...inAxis);
        nextAttack.queue.push(...offAxis);
    }

    #attackQueued() {
        const [row, col] = this.nextAttack.queue.shift();
        return this.attack(col, row);
    }

    // #createSuspicion() {
    //     if (this.nextAttack.hits.length < 2 || Array.isArray(this.nextAttack.hits[0][0])) {
    //         return
    //     }
    //     const nextAttack = this.nextAttack
    //     const isHorizontal = nextAttack.hits[0][1] === nextAttack.hits[1][1];
    //     const dirIndex = isHorizontal ? 1 : 0;
    //     const dirValue = nextAttack.hits[0][dirIndex];
    //
    //     if (!nextAttack.queue.filter(att => att[dirIndex] === dirValue).length) {
    //         console.log('crear sospecha')
    //     }
    // }
}

export default Player;
