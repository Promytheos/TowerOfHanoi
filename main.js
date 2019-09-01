
(function main(){
    //check if dom has loaded, if not wait 10ms and check again
    try {
        var mainGameContainer = document.createElement('div');
        mainGameContainer.id = 'mainGameContainer';
        document.body.appendChild(mainGameContainer);
        var moveCount = document.getElementById('moveCount');
        moveCount.innerText = 0;
        var ringCountEl = document.getElementById('ringCount');
        var ringAdder = document.getElementById('ringAdder');
        var ringRemover = document.getElementById('ringRemover');
        var ringCountValue = Number(ringCountEl.innerText);
        ringAdder.onclick = function () {
            if(ringCountValue<7){
                ringCountValue = ringCountValue + 1;
                ringCountEl.innerText = ringCountValue;
                mainGameContainer.remove();
                main();
            }
        }; 
        ringRemover.onclick = function () {
            if (ringCountValue > 3) {
                ringCountValue = ringCountValue - 1;
                ringCountEl.innerText = ringCountValue;
                mainGameContainer.remove();
                main();
            }
        };
    } catch (error) {
        setTimeout(() => {
            main();
        }, 10);
    }

    //create player
    function Player() {
        this.moves = 0;
    }

    //create prototype for game objects
    function GameObject(type, priority) {
        this.type = type;
        this.priority = priority;
        this.name = type + priority;
        this.selected = false;
    };
    
    GameObject.prototype.createObject = function () {
        this.element = document.createElement('div');
        this.element.id = this.type + this.priority;
        this.element.classList.add(this.type);
        mainGameContainer.appendChild(this.element);
    }

    GameObject.prototype.addEvent = function (type, method) {
        var thing = method;
        this.element.addEventListener(type, function () {
            thing();
        })
    };

    
    function Ring (priority){
        GameObject.call(this, 'ring', priority);
        this.createObject();
        this.currentTower = '';
    }
    
    function Tower(priority) {
        GameObject.call(this, 'tower', priority);
        this.createObject();
        this.rings = [];
    }
    Tower.prototype = Object.create(GameObject.prototype);
    Ring.prototype = Object.create(GameObject.prototype);
    
    Ring.prototype.select = function (itemArray) {
        itemArray.forEach(item => {
            if (item === this) {
                this.selected = !this.selected;
                if (this.selected) {
                    item.element.classList.add('selected');
                } else {
                    item.element.classList.remove('selected');
                }
            } else {
                item.selected = false;
                item.element.classList.remove('selected');
            }
            // console.log(item);
        });
    };

    Ring.prototype.setTower = function (destination) {
        var canAdd = true;
        destination.rings.forEach(ring => {
            if (ring.priority < this.priority &&this.currentTower !== ''){
                canAdd = false;
            }
        }); 
        if (this.currentTower){
            this.currentTower.rings.forEach(ring => {
                if (ring.priority < this.priority && this.currentTower !== '') {
                    canAdd = false;
                }
            });
            if (canAdd === true){
                this.currentTower.rings.splice(this.currentTower.rings.indexOf(this),1);
            }
        }
        if (canAdd === true){
            if (this.currentTower !== destination && this.currentTower !== ''){
                player.moves++;
                if(moveCount){
                    moveCount.innerText = player.moves;
                }
            }
            this.element.style.bottom = destination.rings.length * (this.element.offsetHeight/(this.element.parentNode.offsetHeight-6)) * 100 + '%';
            this.element.style.left = ((destination.element.offsetLeft-this.element.offsetWidth/2 + destination.element.offsetWidth/2)/(destination.element.parentNode.offsetWidth-6)) * 100 + '%';
            this.selected = false;
            this.element.classList.remove('selected');
            this.currentTower = destination;
            destination.rings.push(this);
        }
    };

    Tower.prototype.setDestination = function (itemArray) {
        itemArray.forEach(item => {
            if (item.type === 'ring' && item.selected) {
                item.setTower(this);
            }
        });
        if (this.name === 'tower3' && this.rings.length === Number(ringCountValue)){
            setTimeout(() => {
                alert('You win! Moves: ' + player.moves);
                mainGameContainer.remove();
                main();
            }, 100);
        }
    };

    function createRings(ringCount) {
        var rings=[];
        for (let r = 0; r < ringCount; r++) {
            rings[r] = new Ring(ringCount-r);
            rings[r].element.style.width = 5 * (ringCount - r) + '%';
        }
        //mainGameContainer.style.width = rings[ringCount].offsetWidth * ringCount + 'px';
        return rings;
    }

    function setupRings(rings, firstTower) {
        rings.forEach(ring => {
            ring.addEvent('click', function () { ring.select(rings) });
            ring.setTower(firstTower);
        });
    }
    
    var tower1 = new Tower(1),
        tower2 = new Tower(2),
        tower3 = new Tower(3);
        var player = new Player();
    var rings = createRings(ringCountValue);
    setupRings(rings, tower1);
    var towers = [tower1, tower2, tower3];
    tower1.addEvent('click', function () { 
        tower1.setDestination(rings);});
    tower2.addEvent('click', function () {
        tower2.setDestination(rings) });
    tower3.addEvent('click', function () {
        tower3.setDestination(rings) });

    function solveGame(rings, towers) {
        //move 1
        var finalDestination = towers[towers.length-1];
        var counter = 0;
        rings.forEach(ring => {
            counter++;
            ring.select(rings);
            towers[towers.length - counter].setDestination(rings);
        });
        alert('Ok');
        //move 2
        var dest;
        var counter = 0;
        towers.forEach(tower => {
            if (Number(tower.name.split('r')[1]) === Number(rings[0].currentTower.name.split('r')[1])-1){
                dest = tower;
            }            
        });
        rings[0].select(rings);
        dest.setDestination(rings);

        //move 3
        rings[rings.length-1].select(rings);
        towers[towers.length-1].setDestination(rings);

        //move 4
        rings[0].select(rings);
        towers[0].setDestination(rings);

        //move 5
        rings[1].select(rings);
        towers[towers.length - 1].setDestination(rings);

        //move 6
        rings[0].select(rings);
        towers[towers.length - 1].setDestination(rings);
    };

    //solveGame(rings, towers);
})();