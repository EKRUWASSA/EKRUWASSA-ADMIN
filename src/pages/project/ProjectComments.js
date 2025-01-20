import React, { useRef, useState } from 'react';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  ImageRun,
  HeadingLevel,
  AlignmentType,
  TableOfContents,
  Header,
  Footer,
  PageNumber,
  PageBreak
} from 'docx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import Avatar from "../../components/Avatar";
import { timestamp, projectStorage } from "../../firebase/config";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
// import { v4 as uuid } from "uuid";

const ImageModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-white rounded-lg shadow-lg overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl focus:outline-none z-10"
          onClick={onClose}
          aria-label="Close Modal"
        >
          ✕
        </button>
        <img
          src={imageUrl}
          alt="Enlarged view"
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />
      </div>
    </div>
  );
};



export default function ProjectComments({ project }) {
  const { updateDocument, response } = useFirestore("projects");
  const [newComment, setNewComment] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [docloading, setdocLoading] = useState(false);
  const { user } = useAuthContext();
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [enlargedImage, setEnlargedImage] = useState(null);
  const closeModal = () => {
    setEnlargedImage(null);
  };
  const commentsRef = useRef(null);
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const DateRangeSelector = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => (
    <div className="flex gap-4 items-center mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleImageClick = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };


  const getGeolocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => reject(error)
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!newComment.trim() && !selectedImage) {
      console.log("Comment or image is required.");
      return;
    }
  
    if (project.completed) {
      console.log("Cannot add a new report to a completed project.");
      return;
    }
  
    setLoading(true);
  
    try {
      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }
      const timestamp = Date.now().toString();
      const commentToAdd = {
        displayName: user.displayName,
        photoURL: user.photoURL,
        content: newComment,
        createdAt: timestamp,
        id: timestamp + '-' + user.uid.slice(0, 4),
        imageUrl: imageUrl,
        // Removed location
      };
  
      await updateDocument(project.id, {
        comments: [...project.comments, commentToAdd],
      });
  
      if (!response.error) {
        setNewComment("");
        setSelectedImage(null);
      }
    } catch (error) {
      console.error("Error adding report:", error.message);
    }
  
    setLoading(false);
  };
  
  const uploadImage = async (imageFile) => {
    try {
      const storageRef = projectStorage.ref();
      const imageName = `${Date.now()}_${imageFile.name}`;
      const imageRef = storageRef.child(`images/${imageName}`);
      await imageRef.put(imageFile);
      const imageUrl = await imageRef.getDownloadURL();
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const generateDocument = async (comments) => {
    const doc = new Document({
      creator: "Project Report System",
      title: `Project Report - ${project.name}`,
      description: "Generated report of project comments",
      sections: [
        // {
        //   properties: {
        //     page: {
        //       margin: {
        //         top: 1440,
        //         right: 1440,
        //         bottom: 1440,
        //         left: 1440,
        //       },
        //     },
        //   },
        //   children: [
        //     new Paragraph({
        //       heading: HeadingLevel.HEADING_1,
        //       text: "Project Comments Report",
        //       alignment: AlignmentType.CENTER,
        //     }),
        //     new Paragraph({
        //       text: `Generated on ${format(new Date(), "MMMM dd, yyyy")}`,
        //       alignment: AlignmentType.CENTER,
        //     }),
      
        //   ],
        // },
      ],
    });
  
    const sections = [];
  
    for (const comment of comments) {
      const commentDate = format(
        new Date(parseInt(comment.createdAt)),
        "MMMM dd, yyyy HH:mm"
      );
  
      sections.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({
              text: `Comment from ${comment.displayName}`,
              bold: true,
              size: 28,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: commentDate,
              size: 14,
              color: "666666",
            }),
          ],
        })
      );
  
      if (comment.content) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: comment.content,
                size: 24,
              }),
            ],
          })
        );
      }
  
      if (comment.location) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Location: ${comment.location.latitude}, ${comment.location.longitude}`,
                size: 14,
                color: "666666",
              }),
            ],
          })
        );
      }
  
      if (comment.imageUrl) {
        try {
          // Use a CORS proxy service to fetch the image
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
            comment.imageUrl
          )}`;
  
          const response = await fetch(proxyUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
          }
  
          const imageBuffer = await response.arrayBuffer();
  
          sections.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: imageBuffer,
                  transformation: {
                    width: 400,
                    height: 300,
                  },
                }),
              ],
            })
          );
        } catch (error) {
          console.error("Error downloading image:", error);
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `[Image could not be loaded: ${comment.imageUrl}]`,
                  color: "FF0000",
                }),
              ],
            })
          );
        }
      }
  
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "─".repeat(50),
              color: "666666",
            }),
          ],
          spacing: {
            before: 240,
            after: 240,
          },
        })
      );
    }
  
    doc.addSection({
      children: sections,
    });
  
    return doc;
  };
  
  
  
  const downloadComments = async () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filteredComments = project.comments.filter((comment) => {
      const createdAt = new Date(parseInt(comment.createdAt));
      return createdAt >= start && createdAt <= end;
    });

    if (filteredComments.length === 0) {
      alert("No comments found in the selected date range");
      return;
    }

    try {
      setdocLoading(true);
      const doc = await generateDocument(filteredComments);
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${project.name}_Report_${format(new Date(), 'yyyy-MM-dd')}.docx`);
    } catch (error) {
      console.error('Error generating document:', error);
      alert("Error generating document. Please try again.");
    } finally {
      setdocLoading(false);
    }
  };


  return (
    <div className="project-comments">
      <div>
        {!project.completed && (
          <form className="add-comment" onSubmit={handleSubmit}>
            <label>
              <span>Add new report</span>
              <textarea
                onChange={(e) => setNewComment(e.target.value)}
                value={newComment}
                className="w-full p-2 border rounded"
              ></textarea>
            </label>

            <button 
              className="btn mt-1 bg-blue-500 text-white px-4 py-2 rounded" 
              type="submit" 
              disabled={loading}
            >
              {loading ? "Loading..." : "Add Report"}
            </button>
          </form>
        )}

<div className="my-6 p-4 border rounded-2xl bg-white">
        <h3 className="text-xl font-medium mt-1">Download Comments</h3>
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        <button 
              disabled={docloading}
          onClick={downloadComments}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 btn"
        >
         
          {docloading ? "Generating Document..." : " Download Selected Range"}
        </button>
      </div>
      </div>

   

      <ul className="comments space-y-4" ref={commentsRef}>
        {project.comments.length > 0 &&
          project.comments.map((comment) => (
            <li key={comment.id} className="border rounded p-4">
              <div className="comment-author">
                {comment.imageUrl && (
                  <img
                    src={comment.imageUrl}
                    alt="Comment"
                    className="comment-image cursor-pointer hover:opacity-90 transition-opacity "
                    onClick={() => handleImageClick(comment.imageUrl)}
                  />
                )}
              </div>
              <div className="comment-content mt-2">
                <p>{comment.content}</p>
                <div className="comment-date text-sm text-gray-600 mt-2">
                  <p>
                    {format(new Date(parseInt(comment.createdAt)), "HH:mm 'on' dd/MM/yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Avatar src={comment.photoURL} />
                  <span>{comment.displayName}</span>
                </div>
                {comment.location && (
                  <div className="comment-location text-sm text-gray-600 mt-2">
                    <p>Location: {comment.location.latitude}, {comment.location.longitude}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
      </ul>

      {/* <ImageModal imageUrl={enlargedImage} onClose={closeModal} /> */}
    </div>
  );
}