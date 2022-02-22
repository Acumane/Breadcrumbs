#include <iostream>
#include <string>
#include <list>
#include "wgraph.h"

int main(int argc, char * argv[]) {

    Wgraph test1 = Wgraph();
    test1.add("a",100);
    test1.add("b",100);
    test1.add("c",100);
    test1.print();
    test1.connect("a","b");
    test1.connect("a","c");
    test1.printConnect();


}