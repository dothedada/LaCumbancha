const renderInDOM = (() => {
    const inputText = (labelText, placeholderText) => {
        const label = document.createElement('label');
        const inputElement = document.createElement('input');

        label.textContent = labelText;
        inputElement.type = 'text';
        inputElement.placeholder = placeholderText;

        label.append(inputElement);

        return label;
    };

    const button = (buttonText, css = '', attribute = '', disabled = false) => {
        const buttonElement = document.createElement('button');

        buttonElement.type = 'button';
        buttonElement.className = css;
        buttonElement.textContent = buttonText;

        if (attribute) {
            buttonElement.setAttribute('data-impact', attribute);
        }
        if (disabled) {
            buttonElement.disabled = true;
        }

        return buttonElement;
    };

    const wrapper = (type, css = '', text = '') => {
        const element = document.createElement(type);
        element.className = css;
        element.textContent = text;

        return element;
    };

    const attackBoard = (player) => {
        const board = wrapper('div', 'board');

        for (let i = 0; i < 11; i++) {
            const text = i === 0 ? '\\' : String.fromCharCode(64 + i);
            const boardHeader = wrapper('span', 'board__coordenates', text);
            board.append(boardHeader);
        }

        let row = 1;
        player.myAttacks.flat().forEach((cell, index) => {
            let dataImpact = '';
            let disabled = false;
            let buttonText = '';

            if (index % 10 === 0) {
                board.append(wrapper('span', 'board__coordenates', row));
                row++;
            }

            if (cell) {
                dataImpact = cell === 'X' ? 'ship' : 'water';
                disabled = true;
                buttonText = cell;
            }

            board.append(
                button(buttonText, 'board__attack', dataImpact, disabled),
            );
        });

        return board;
    };

    const shipsBoard = (player) => {
        const board = wrapper('div', 'board');

        for (let i = 0; i < 11; i++) {
            const text = i === 0 ? '\\' : String.fromCharCode(64 + i);
            const boardHeader = wrapper('span', 'board__coordenates', text);
            board.append(boardHeader);
        }

        let row = 1;
        player.myShips.flat().forEach((cell, index) => {
            let text = '';

            if (index % 10 === 0) {
                board.append(wrapper('span', 'board__coordenates', row));
                row++;
            }

            if (cell) {
                text = typeof cell === 'object' ? cell.type.slice(0, 2) : cell;
            }

            board.append(wrapper('span', 'board__ships', text));
        });

        return board;
    };

    return { inputText, button, wrapper, attackBoard, shipsBoard };
})();

export default renderInDOM;
