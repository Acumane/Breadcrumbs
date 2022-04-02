/*
    This file is part of Magnum.

    Copyright © 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019,
                2020, 2021, 2022 Vladimír Vondruš <mosra@centrum.cz>

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included
    in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.
*/

#include <Corrade/Utility/Arguments.h>

#include "Magnum/Platform/WindowlessWindowsEglApplication.h"

namespace Magnum { namespace Platform { namespace Test { namespace {

struct WindowlessWindowsEglApplicationTest: Platform::WindowlessApplication {
    explicit WindowlessWindowsEglApplicationTest(const Arguments& arguments);
    int exec() override { return 0; }
};

WindowlessWindowsEglApplicationTest::WindowlessWindowsEglApplicationTest(const Arguments& arguments): Platform::WindowlessApplication{arguments, NoCreate} {
    Utility::Arguments args;
    args.addSkippedPrefix("magnum", "engine-specific options")
        .addBooleanOption("quiet").setHelp("quiet", "like --magnum-log quiet, but specified via a Context::Configuration instead")
        .addBooleanOption("gpu-validation").setHelp("gpu-validation", "like --magnum-gpu-validation, but specified via a Context::Configuration instead")
        .parse(arguments.argc, arguments.argv);

    Configuration conf;
    if(args.isSet("quiet"))
        conf.addFlags(Configuration::Flag::QuietLog);
    /* No verbose logs in this app */
    if(args.isSet("gpu-validation"))
        conf.addFlags(Configuration::Flag::GpuValidation);
    createContext(conf);
}

}}}}

MAGNUM_WINDOWLESSAPPLICATION_MAIN(Magnum::Platform::Test::WindowlessWindowsEglApplicationTest)