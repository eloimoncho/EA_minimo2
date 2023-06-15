import React, { useEffect, useState } from "react";
import { ActivityEntity } from "../../models/activity.model";
import { useTranslation } from "react-i18next";
import "./activity.component.css"
import { UserService } from "../../services/user.service";
import { User } from "../../models/user.model";
import { Link } from "react-router-dom";
import { RatingsService } from "../../services/ratings.service";
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';



interface ActivityDetailsModalProps {
  activity: ActivityEntity;
  onClose: () => void;
  onAddToActivity: (isJoining: boolean) => void;
  userId: string;
}
console.log("Entro al modal");
const ActivityDetailsModal: React.FC<ActivityDetailsModalProps> = ({
    activity,    
    onClose,
    onAddToActivity,
    userId,
  }) => {
    const { t } = useTranslation();
    const [participants, setParticipants] = useState(activity.participantsActivity || []);
    const [isCurrentUserParticipant, setIsCurrentUserParticipant] = useState(participants.includes(userId));
    const [isCreatorOfActivity, setIsCreatorOfActivity] = useState(activity.creatorActivity.includes(userId));
    const [creatorUser, setCreatorUser] = useState<User | null>(null);
    const [creatorAppName, setCreatorAppName] = useState<string>("");
    const [ratedActivity, setRatedActivity] = useState<number>(0);


    useEffect(() => {
      const fetchCreatorAppName = async (uuid: string) => {
        try {
          const response = await UserService.getPerson(uuid);
          const user = response.data;
          setCreatorUser(user);
          setCreatorAppName(user.appUser || "");
          if(activity.uuid){
            const rating = await ratingActivity(activity.uuid);
            setRatedActivity(rating);
          }
          

        } catch (error) {
          console.log(error);
        }
      };
      fetchCreatorAppName(activity.creatorActivity);
    } , [activity.creatorActivity]);

    
    const handleAddToActivity = (isJoining: boolean) => {
      setIsCurrentUserParticipant(!isCurrentUserParticipant);
      onAddToActivity(isJoining);
    };

    const showJoinButton = !isCreatorOfActivity;

    const ratingActivity = async (uuid: string) => {
      const response = await RatingsService.getRatingOf(uuid,"activities");
      console.log(response.data)
      if (response.data.ratingAverage){
        return response.data.ratingAverage;
      }
      else{
        return 0;
      }
    };

    const renderStars = () => {
      
      const filledStars = Math.floor(ratedActivity);
      const decimalStar = ratedActivity - filledStars;
      const emptyStars = 5 - filledStars;
      const barWidth = `${ratedActivity * 20}%`;
    
      const stars = [];
    
      for (let i = 0; i < filledStars; i++) {
        stars.push(<AiFillStar key={i} className="star filled" />);
      }
    
      if (decimalStar > 0) {
        const decimalStarWidth = `${decimalStar * 20}%`;
        stars.push(
          <AiFillStar
            key={filledStars}
            className="star filled decimal"
            style={{ width: decimalStarWidth }}
          />
        );
      }
    
      for (let i = 0; i < emptyStars; i++) {
        stars.push(<AiOutlineStar key={filledStars + i} className="star empty" />);
      }
    
      return (
        <div className="stars-container">
          <div className="stars">{stars}</div>
          <div className="rating-bar" style={{ width: barWidth }}></div>
        </div>
      );
    };
    



    return (
      <div className="modal">
        <div className="modal-content">
          <h2>{t("ActivityDetails")}</h2>
          <p>{t("Name")}: {activity.nameActivity}</p>
          <p>{t("Date")}: {new Date(activity.dateActivity).toISOString().substr(0, 10)}</p>
          <p>{t("Description")}: {activity.descriptionActivity}</p>
          {creatorUser && (
            <Link to={`/user/${creatorUser.uuid}`} className="user-link">
              <div className="post__header">
                <img className="post__profile-img" src={`${creatorUser.photoUser}`} alt="Profile"/>
                  <div className="post__info">
                    <p className="post__username_header">{t("Creator")}: {creatorAppName}</p>
                  </div>
              </div>
            </Link>
            )
          }
          <p>Participantes: {activity.participantsActivity?.join(", ")}</p>
          <div className="rating-container">
            <p>Rating: {ratedActivity} {renderStars()}</p>
          </div>
          
          <button onClick={onClose}>{t("Close")}</button>
          {showJoinButton && (
          <button onClick={() => handleAddToActivity(!isCurrentUserParticipant)}>
            {isCurrentUserParticipant ? "Leave Activity" : "Join Activity"}
          </button>
        )}
        </div>
      </div>
    );
  };

export default ActivityDetailsModal;
