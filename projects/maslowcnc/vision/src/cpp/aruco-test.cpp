#include <stdio.h>
#include <stdlib.h>

#include <vector>
#include <string>

#include <opencv2/opencv.hpp>
#include <opencv2/core/core.hpp>
#include <opencv2/aruco.hpp>

int main(int argc, char **argv) {
  int i;
  std::string fn = "/home/abe/git/github/opencv/opencv_contrib/modules/aruco/tutorials/aruco_detection/images/singlemarkersoriginal.png";


  cv::Mat markerImage;
  //cv::aruco::Dictionary dict = cv::aruco::getPredefinedDictionary(cv::aruco::DICT_6X6_250);
  //cv::aruco::drawMarker( dict, 23, 200, markerImage, 1);

  cv::Mat inputImage;
  std::vector<int> markerIds;
  std::vector< std::vector< cv::Point2f > > markerCorners, rejectedCandidates;
  //cv::aruco::DetectorParameters parameters;
  cv::Ptr<cv::aruco::DetectorParameters> param = cv::aruco::DetectorParameters::create();

  //cv::Ptr<cv::aruco::Dictionary> dict = cv::aruco::getPredefinedDictionary(cv::aruco::DICT_6X6_250);

  cv::Ptr<cv::aruco::Dictionary> dict;
  int predef_dict_id = -1;

  //cv::aruco::Dictionary dict2 = cv::aruco::getPredefinedDictionary(cv::aruco::DICT_6X6_250);
  //cv::Ptr<cv::aruco::DetectorParameters> param; // = &parameters;

  if (argc>1) {
    fn = argv[1];
    dict =  cv::aruco::getPredefinedDictionary(cv::aruco::DICT_4X4_250);
    predef_dict_id = cv::aruco::DICT_4X4_250;
  }
  else {
    dict = cv::aruco::getPredefinedDictionary(cv::aruco::DICT_6X6_250);
    predef_dict_id = cv::aruco::DICT_6X6_250;
  }


  printf("# using: fn %s, DICT %i\n", fn.c_str(), predef_dict_id);

  //inputImage = cv::imread(fn.c_str(), cv::IMREAD_GRAYSCALE);
  inputImage = cv::imread(fn);

  printf("# inputImage (%i,%i)\n", (int)inputImage.rows, (int)inputImage.cols);
  printf("# param->minMarkerDistanceRate: %f\n", (float)param->minMarkerDistanceRate);

  //cv::aruco::drawMarker( dict, 23, 200, markerImage, 1);

  //cv::aruco::detectMarkers(inputImage, dict, markerCorners, markerIds, param, rejectedCandidates);
  cv::aruco::detectMarkers(inputImage, dict, markerCorners, markerIds, param, rejectedCandidates);

  printf("markers[%i]:", (int)markerIds.size());
  for (i=0; i<markerIds.size(); i++) {
    printf(" %i", markerIds[i]);
  }
  printf("\n");

}
