#include <iostream>
#include <fstream>
#include <string>
#include <list>
#include <map>
#include <vector>

class Node {
    public:
        Node() : tag(""), size(0) {}
        Node(std::string t, int s) : tag(t), size(s) {}

        void add(Node * n) { adj.push_back(n); }

        friend std::ostream& operator<<(std::ostream& ostr, Node* n);

        std::string tag;
        int size;
        std::list<Node*> adj;
};
std::ostream& operator<<(std::ostream& ostr, Node* n) {
    ostr << "(" << n->tag << "," << n->size << ")";
    return ostr;
}

class Wgraph {
    public:
        Wgraph() : N(0) {}
        int size() const { return N; }
        void add(std::string t, int s) { table.insert(make_pair(t,new Node(t,s))); }
        void connect(std::string t1, std::string t2) { find(t1)->add(find(t2)); find(t2)->add(find(t1)); }
        Node * find(std::string t) {
            if(table.find(t) != table.end()) return table.find(t)->second;
            else return NULL; }
        void printConnect() { 
            int i = 0;
            for (std::map<std::string,Node*>::iterator itr = table.begin(); itr != table.end(); itr++, i++) {
                std::cout << i << ": " <<  itr->first << " : ";
                for (std::list<Node*>::iterator itr2 = itr->second->adj.begin(); itr2 != itr->second->adj.end(); itr2++)
                    std::cout << " " << *itr2;
                std::cout << std::endl;
            }
        }
        void print() {
            int i = 0;
            for (std::map<std::string,Node*>::iterator itr = table.begin(); itr != table.end(); itr++, i++)
                std::cout << i << ": " <<  itr->first << std::endl;
        }


    private:
        int N; // number of nodes in graph.
        std::map<std::string,Node*> table; // easy access

};