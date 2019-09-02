
(function main(){
    console.clear();
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
        this.element.addEventListener(type, function () {
            method();
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
        this.next = null;
        var that = this;
        this.addEvent('click',
            function () {
                that.setDestination(rings)
            }
        );
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
        console.log('Ring: ' + this.name + ' to Tower: ' + destination.name);
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

    
    var tower1 = new Tower(1);
    tower1.next = new Tower(2);
    tower1.next.next = new Tower(3);
    tower1.next.next.next = tower1;
    var player = new Player();
    var rings = createRings(ringCountValue);
    setupRings(rings, tower1);
        
    function solve(ringArray, currentTower) {
        ringArray[ringArray.length - 1].select(ringArray);
        currentTower.next.next.setDestination(ringArray);
        ringArray[ringArray.length - 2].select(ringArray);
        currentTower.next.setDestination(ringArray);
        ringArray[ringArray.length - 1].select(ringArray);
        currentTower.next.setDestination(ringArray);
        ringArray[ringArray.length - 3].select(ringArray);
        currentTower.next.next.setDestination(ringArray);
        ringArray[ringArray.length - 1].select(ringArray);
        currentTower.setDestination(ringArray);
        ringArray[ringArray.length - 2].select(ringArray);
        currentTower.next.next.setDestination(ringArray);
        ringArray[ringArray.length - 1].select(ringArray);
        currentTower.next.next.setDestination(ringArray);
    };

    //solve(rings, tower1);
})();