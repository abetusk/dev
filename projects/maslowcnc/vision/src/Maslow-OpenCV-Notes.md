Creating a (MaslowCNC) Docker OpenCV container
===

This will be a general development log of how I got OpenCV in a container
with a specific eye towards using the Aruco library that's built with OpenCV.

To build the (latest) OpenCV, this can be done:


```
git clone https://github.com/opencv/opencv.git
cd opencv
mkdir build ; cd build
cmake -DBUILD_TIFF=ON -DBUILD_NEW_PYTHON_SUPPORT=ON -DBUILD_opencv_python3=ON -DHAVE_opencv_python3=ON ..
make
make install
```

I was getting errors in not finding `tmsize_t` when trying to compile (`make`) and
using the directive to `cmake` looks to have gotten past the issue
(taken from an answer on [answers.opencv.org](http://answers.opencv.org/question/178962/compile-time-errors-with-cvtiffdecoderbufhelper/)).
The extra Python directives are there to make sure the OpenCV Python libraries get built.


Looks like also cloning and building the `opencv_contrib` is necessary for the Aruco portion:

```
git clone https://github.com/opencv/opencv_contrib.git
cd opencv_contrib
mkdir build ; cd build
cmake -DBUILD_TIFF=ON -DOPENCV_EXTRA_MODULES_PATH=../modules ../../opencv
make
make install
```

(we get the same error with the tiff issue if we don't include the same directive as above).

In the Python file, insert the following at the header to ensure the proper library is used:

```
import sys
sys.path.insert(0, '/usr/local/python/cv2/python-2.7/')
```

---

For Docker containers, it looks like you can maybe do
[something like](https://stackoverflow.com/questions/24225647/docker-a-way-to-give-access-to-a-host-usb-or-serial-device)
to get the USB serial bridge going:

```
docker run -t -i --privileged -v /dev/bus/usb:/dev/bus/usb ubuntu bash
```

I haven't tested but hopefully this should allow for any USB devices attached after the Docker container has started running
to be seen inside the docker container.

Dockerfile
---

The `Dockerfile` is provided as well, but for quick reference, here it is:

```
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

RUN apt-get install -y vim
```

References
---

* [Install OpenCV-Python in Ubuntu](https://docs.opencv.org/3.4.1/d2/de6/tutorial_py_setup_in_ubuntu.html)
* [SO: Docker - a way to give access to a host USB or serial device?](https://stackoverflow.com/questions/24225647/docker-a-way-to-give-access-to-a-host-usb-or-serial-device)
* [Compile-time errors with cv::TiffDecoderBufHelper](http://answers.opencv.org/question/178962/compile-time-errors-with-cvtiffdecoderbufhelper/)
* [Aruco in OpenCV](http://www.philipzucker.com/aruco-in-opencv/)
