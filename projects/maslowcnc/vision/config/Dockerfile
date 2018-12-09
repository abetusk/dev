FROM debian

USER root

RUN apt-get update && \
  apt-get install -y build-essential libssl-dev git \
    less wget \
    libncurses5-dev autoconf libbz2-dev liblzma-dev \
    cmake libhts-dev parallel \
    python-pip \
    python-dev python-numpy python3-dev python3-numpy \
    pkg-config python-setuptools

RUN mkdir -p /root/git && \
  cd /root/git && \
  git clone https://github.com/opencv/opencv && \
  git clone https://github.com/opencv/opencv_contrib && \
  cd /root/git/opencv && mkdir build && cd build && \
    cmake -DBUILD_TIFF=ON -DBUILD_NEW_PYTHON_SUPPORT=ON -DBUILD_opencv_python3=ON -DHAVE_opencv_python3=ON .. && \
    make && make install && \
  cd /root/git/opencv_contrib && mkdir build && cd build && \
    cmake -DBUILD_TIFF=ON -DOPENCV_EXTRA_MODULES_PATH=../modules ../../opencv && \
    make -j5 && make install

RUN apt-get install -y vim imagemagick
