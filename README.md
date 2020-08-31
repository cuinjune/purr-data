# Purr Data

## Overview
This document describes the work that was done under [Google Summer of Code 2020](https://summerofcode.withgoogle.com/) for organization Purr Data. The project idea was to make the native Purr Data run in a web browser by adding a WebAssembly target and HTML5 GUI framework.

**Purr Data** a.k.a. **Pd-l2ork 2** is an improved version of Miller Puckette’s Pd.

[Pd](https://puredata.info/) (Pure Data) is a graphical data-flow programming environment which is geared towards real-time interactive computer music and multimedia applications. It is a full-featured open-source alternative to its commercial sibling, Cycling74’s Max.

[Purr Data](https://agraef.github.io/purr-data/) serves the same purpose, but offers a new and much improved graphical user interface and includes many 3rd party plug-ins. Like Pd, it runs on Linux, macOS and Windows, and is open-source throughout.

The goal of this project was to make the Purr Data run in a web browser so it can be more accessible to users and make their work more easily shared with other people.

You can try the current version from https://cuinjune-purr-data.glitch.me/

## Source Code
- This repository is a product of GSoC 2020: https://git.purrdata.net/cuinjune/purr-data
- Commit History: https://git.purrdata.net/cuinjune/purr-data/-/commits/emscripten23-test?author=Zack%20Lee
- All my commits have been merged into the organization repository: https://git.purrdata.net/jwilkes/purr-data/-/tree/emscripten
- Most of the files under this directory are my creation https://git.purrdata.net/jwilkes/purr-data/-/tree/emscripten/emscripten
- This repository only cantains files used to run Purr Data in a web browser: https://github.com/cuinjune/purr-data

## Accomplished milestones
- Modified native Purr Data and libpd codebase to make them compatible with [Emscripten](https://emscripten.org/).
- Modified and created Makefile to build for Emscripten and to generate WebAssembly(`.wasm`) binaries for external libraries.
- Cleaned the backend code and organized file system so the project can be easily maintained.
- Integrated the backend with the frontend.
- Fixed some major bugs and errors in the frontend.
