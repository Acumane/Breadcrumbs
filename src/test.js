
class Node {
    constructor(url) {
        this.value = url;
        this.children = [];
        this.parent = null;
    }
}

class Bubble {
    constructor(url) {
        this.root = new Node(url);
        this.size = 1;
    }

    find(url) {
        this.find_body(url,this.root);
    }
    find_body(url, node) {
        if (node.value === url) {
            console.log(node);
            return node;
        }
        else {
            for (var i = 0; i < node.children.size; i++) {
                this.find_body(url,node.children[i]);
            }
        }
    }
    add(v, p) {
        console.log(this.find(p));
        var par;
        console.log(par);
        if (par) {
            let tmp = new Node(v);
            tmp.parent = par;
            par.push(tmp);
            this.size += 1;
        }
    }
    print(node, index) {
        console.log(index + " " + node.value);
        for (var i = 0; i < node.children.size; i++) {
            this.print(node.children[i], index+1);
        }
    }
}

var bubble1  = new Bubble("hello");
bubble1.add("hi","hello");
bubble1.print(bubble1.root,0);