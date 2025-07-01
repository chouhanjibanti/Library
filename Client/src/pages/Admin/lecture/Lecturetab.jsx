import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditCourseLectureMutation,
  useGetLecturebyIdQuery,
  useRemoveLectureMutation,
} from "@/store/api/CreateCourseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

// const MEDIA_API = "http://localhost:8080/api/v1/media"
const MEDIA_API = import.meta.env.VITE_API_URL + "/media";

function Lecturetab() {
  const navigate = useNavigate();
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [btnDisable, setBtnDisable] = useState(true);

  const params = useParams();
  const { CourseId, LectureId } = params;

  const {
    data: getLectureById,
    isLoading: lodingById,
    isSuccess: loadingByIdSuccess,
  } = useGetLecturebyIdQuery(LectureId);
  const lecture = getLectureById?.lecture;

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture?.lectureTitle);
      setIsFree(lecture?.isPreviewFree);
    }
  }, [, lecture]);

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });
        if (res?.data?.success) {
          setUploadVideoInfo({
            videoUrl: res?.data?.data?.url,
            publicId: res?.data?.data?.public_id,
          });

          setBtnDisable(false);
          toast.success(res?.data?.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Video upload failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const [editCourseLecture, { data, isLoading, isError, error, isSuccess }] =
    useEditCourseLectureMutation();

  const submitHandler = async () => {
    await editCourseLecture({
      lectureTitle,
      videoInfo: uploadVideoInfo,
      CourseId,
      LectureId,
      isPreviewFree: isFree,
    });
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message);
    }
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isSuccess, error, isError]);

  const [
    removeLecture,
    {
      data: removeLectureData,
      isLoading: removeLectureLoading,
      isSuccess: removeIsSuccess,
    },
  ] = useRemoveLectureMutation();
  const removeLecturehandler = async () => {
    await removeLecture(LectureId);
  };
  useEffect(() => {
    if (removeIsSuccess) {
      toast.success(removeLectureData?.message);
      navigate(`/admin/course/edit/${CourseId}/lecture`);
    }
  }, [removeIsSuccess, removeLectureData]);

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between">
          <div>
            <CardTitle>Edit Lecture</CardTitle>
            <CardDescription className="mt-2">
              Make Changes and click save when Done.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              disabled={removeLectureLoading}
              onClick={removeLecturehandler}
            >
              {removeLectureLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove Lecture"
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="Ex. Introduction to javascript"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
            />
          </div>
          <div className="my-5">
            <Label>
              Video <span className="text-red-500">*</span>
            </Label>
            <Input
              className="w-fit"
              onChange={fileChangeHandler}
              type="file"
              accept="video/*"
              placeholder="Ex. Introduction to javascript"
            />
          </div>
          <div className="flex items-center gap-2 my-5">
            <Switch
              id="isFree"
              checked={isFree}
              onCheckedChange={(value) => setIsFree(value)}
            />
            <Label htmlFor="isFree">Is this video Free</Label>
          </div>
          {mediaProgress && (
            <div className="my-4">
              <Progress value={uploadProgress} />
              <p>{uploadProgress}% Uploaded</p>
            </div>
          )}
          <div className="mt-4">
            <Button disabled={btnDisable} onClick={submitHandler}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating....
                </>
              ) : (
                "Update Lecture"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default Lecturetab;
