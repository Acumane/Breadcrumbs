#include <iostream>
#include <fstream>
#include <string>
#include <list>
#include "wgraph.h"

void ReadFile(std::string file, Wgraph& w) {

    std::ifstream input(file);
    if (!input.good()) {
        std::cerr << "ERROR: failed to open input file" << std::endl;
        exit(1);
    }
    std::string prev = "false";
    std::string buffer;
    while(input >> buffer) {
        std::string buffer2;
        input >> buffer2;
        w.add(buffer,buffer2,100);
        if (prev != "false") 
            w.connect(buffer,prev);
        prev = buffer;
    }

    input.close();
}

int main(int argc, char * argv[]) {

    if (argc != 2) {
        std::cerr << "ERROR: wrong number of inputs detected." << std::endl;
        exit(1);
    }
    // argv[2] == input file for testing purposes.
    Wgraph test1 = Wgraph();
    ReadFile(std::string(argv[1]), test1);
    test1.print();
    test1.printConnect();


}