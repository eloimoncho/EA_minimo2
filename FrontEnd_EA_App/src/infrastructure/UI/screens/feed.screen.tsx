import { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, TextInput, ImageBackground, Platform } from "react-native";
import { Publication, PublicationEntity } from "../../../domain/publication/publication.entity";
import { SessionService } from "../../services/user/session.service";
import { PublicationService } from "../../services/publication/publication.service";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { UserEntity } from "../../../domain/user/user.entity";
import { CRUDService } from "../../services/user/CRUD.service";
import React from "react";
import { CommentService } from "../../services/comment/comment.service";
import { CommentEntity } from "../../../domain/comment/comment.entity";
import StyledTextInputs from "../components/inputs/StyledTextInputs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Font from 'expo-font';

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
    'SFNS': require('../../../../assets/fonts/SFNS.otf'),
  });
}

export default function FeedScreen() {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [listPublications, setListPublications] = useState<Publication[]>([]);
  const [numPagePublication, setNumPagePublication] = useState<number>(1);
  const [commentsVisibility, setCommentsVisibility] = useState<{[key: string]: boolean; }>({});
  const [pageComments, setPageComments] = useState<{ [key: string]: number }>({});
  const [commentButton, setCommentButton] = useState<{ [key: string]: string }>({});
  const [listCommentsPublication, setListCommentsPublication] = useState<{ [key: string]: CommentEntity[] }>({});
  const [showCommentForm, setShowCommentForm] = useState<{[key: string]: boolean; }>({});
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [recargar, setRecargar] = useState<string>('Inicio');
  const [numPublications, setNumPublications] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<{[key: string]: boolean; }>({});
  const [reloadPublication, setReloadPublication] = useState<string>('');
  const isFocused = useIsFocused();

  // STORIES
  const [userList, setUserList] = useState<UserEntity[]>([]);
  const [numPage, setNumPage] = useState(1);

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => {
      setFontsLoaded(true);
      loadUserList();
    });
  }, []);

  const titleFont = Platform.select({
    ios: 'Rafaella',
    android: 'Rafaella',
  });
  const bodyFont = Platform.select({
    ios: 'SFNS',
    android: 'SFNS',
  });

  useFocusEffect(
    React.useCallback(() => {
      console.log("Iniciamos feed");
      const fetchData = async () => {
        const userId = await SessionService.getCurrentUser();
        if (userId) {
          try {
            const response = await CRUDService.getUser(userId);
            console.log("Punto 1:", response);
            console.log(response?.data);
            setCurrentUser(response?.data);
  
            PublicationService.feed(numPagePublication.toString(), userId)
              .then((response) => {
                console.log(response);
                console.log(response.data);
                console.log("userId", userId);
  
                const initialVisibility = response.data.reduce(
                  (acc: { [key: string]: boolean }, publication: Publication) => {
                    acc[publication.uuid] = false;
                    return acc;
                  },
                  {}
                );
                //setCommentsVisibility(initialVisibility);
                //setCommentsVisibility((prevVisibility) => ({...prevVisibility, initialVisibility}));
                setCommentsVisibility(prevVisibility => {
                  const updatedVisibility = Object.assign({}, prevVisibility, initialVisibility);
                  return updatedVisibility;
                });

  
                const initialPage = response.data.reduce(
                  (acc: { [key: string]: number }, publication: Publication) => {
                    acc[publication.uuid] = 1;
                    return acc;
                  },
                  {}
                );
                //setPageComments(initialPage);
                //setPageComments((prevPageComments) => ({...prevPageComments,initialPage}));
                setPageComments(prevPageComments => {
                  const updatedPageComments = Object.assign({}, prevPageComments, initialPage);
                  return updatedPageComments;
                });
  
                const initialCommentButton = response.data.reduce(
                  (acc: { [key: string]: string }, publication: Publication) => {
                    acc[publication.uuid] = "Show Comments";
                    return acc;
                  },
                  {}
                );
                //setCommentButton(initialCommentButton);
                //setCommentButton((prevCommentButton) => ({...prevCommentButton,initialCommentButton}));
                setCommentButton(prevCommentButton => {
                  const updatedCommentButton = Object.assign({}, prevCommentButton, initialCommentButton);
                  return updatedCommentButton;
                });
  
                const initialListComments = response.data.reduce(
                  (acc: { [key: string]: Comment[] }, publication: Publication) => {
                    acc[publication.uuid] = [];
                    return acc;
                  },
                  {}
                );
                //setListCommentsPublication(initialListComments);
                //setListCommentsPublication((prevListCommentsPublication) => ({...prevListCommentsPublication,initialListComments}));
                setListCommentsPublication(prevListCommentsPublication => {
                  const updatedListCommentsPublication = Object.assign({}, prevListCommentsPublication, initialListComments);
                  return updatedListCommentsPublication;
                });

                const initialCommentText= response.data.reduce(
                  (acc: { [key: string]: string }, publication: Publication) => {
                    acc[publication.uuid] = "";
                    return acc;
                  },
                  {}
                );
                //setCommentText(initialCommentText);
                //setCommentText((prevCommentButton) => ({...prevCommentButton,initialCommentText}));
                setCommentText(prevCommentButton => {
                  const updatedCommentText = Object.assign({}, prevCommentButton, initialCommentText);
                  return updatedCommentText;
                });

                const initialShowLikes = response.data.reduce(
                  (acc: { [key: string]: boolean }, publication: Publication) => {
                    const hasLiked = publication.likesPublication?.includes(userId) || false;
                    acc[publication.uuid] = hasLiked;
                    return acc;
                  },
                  {}
                );
                //setHasLiked(initialShowLikes);
                //setHasLiked((prevHasLiked) => ({...prevHasLiked,initialShowLikes}));
                setHasLiked(prevHasLiked => {
                  const updatedHasLiked = Object.assign({}, prevHasLiked, initialShowLikes);
                  return updatedHasLiked;
                });
                
  
                setListPublications(prevPublications => [...prevPublications, ...response.data]);
              })
              .catch(error => {
                navigation.navigate('NotFoundScreen' as never);
                console.log(error)
              });
              PublicationService.numPublicationsFollowing(userId)
              .then((response) => {
                console.log(response);
                console.log(response.data);
                setNumPublications(response.data);
              })
          } catch (error) {
            console.log("Encontre el id pero no va");
          }
        }
      };
      console.log(recargar);
      if(isFocused){
        if(recargar == "Inicio" || recargar == "More Publications" ){
          console.log(numPagePublication);
          fetchData();
        }else if(recargar == "New Comment" || recargar == "Delete Like" || recargar == "Update Like"){
          console.log(reloadPublication);
          PublicationService.onePublication(reloadPublication)
          .then((response) => {
            console.log(response.data);
            const index = listPublications.findIndex((publication) => publication.uuid === reloadPublication);
  
            if (index >= 0) {
              listPublications.splice(index, 1, (response.data));
              setListPublications([...listPublications]);
            }
  
          })
          .catch(error => {
            navigation.navigate('NotFoundScreen' as never);
            console.log(error)
          });
        }
      }else{
        setCurrentUser(null);
        setListPublications([]);
        setNumPagePublication(1);
        setCommentsVisibility({});
        setPageComments({});
        setCommentButton({});
        setListCommentsPublication({});
        setShowCommentForm({});
        setCommentText({});
        setRecargar('Inicio');
        setNumPublications(0);
        setHasLiked({});
        setReloadPublication('');
      }
      
      
    }, [isFocused, recargar])
  );
  
  const handleGoToScreenUser = (uuid:string) => {
    navigation.navigate("UserScreen" as never, {uuid} as never);
    setRecargar("No Recargues");
  };

  const handleLoadMore = async () => {
    console.log("Has pulsado el btn");
    setRecargar("More Publications");
    setNumPagePublication((prevPage) => prevPage + 1);
  };

  const getComments = (idPublication: string) => {
    console.log("Ver comentarios");
    console.log("idPublication: " + idPublication);
    console.log("commentsVisibility[PublicationId]=" + commentsVisibility[idPublication]);
    console.log("pageComments[PublicationId]=" + pageComments[idPublication]);
    setCommentsVisibility((prevVisibility) => {
      const updatedVisibility = {
        ...prevVisibility,
        [idPublication]: !prevVisibility[idPublication],
      };
      console.log("second " + updatedVisibility[idPublication]);

      if (updatedVisibility[idPublication]) {
        setCommentButton((prevCommentButton) => ({
          ...prevCommentButton,
          [idPublication]: (prevCommentButton[idPublication] = "Hide Comments"),
        }));
        console.log("Entro a hide");
        CommentService.getCommentsPublication(idPublication, (pageComments[idPublication]).toString())
        .then(response => {
          console.log(response);
          console.log(response.data);
          setListCommentsPublication(prevListComments => ({
            ...prevListComments,
            [idPublication]: response.data
          }));
        })
        .catch(error => {
          navigation.navigate('NotFoundScreen' as never);
        });
      } else {
        setCommentButton((prevCommentButton) => ({
          ...prevCommentButton,
          [idPublication]: (prevCommentButton[idPublication] = "Show Comments"),
        }));
        console.log("Entro a show");
        setListCommentsPublication((prevListComments) => ({
          ...prevListComments,
          [idPublication]: [],
        }));
        setPageComments((prevPageComments) => ({
          ...prevPageComments,
          [idPublication]: (prevPageComments[idPublication] = 1),
        }));
      }
      return updatedVisibility;
    });
    console.log("Page comentarios:" + pageComments[idPublication]);
  };


  const showMoreComments = (idPublication: string) => {
    console.log("Ver más comentarios");
    setPageComments((prevPageComments) => ({
      ...prevPageComments,
      [idPublication]: prevPageComments[idPublication] + 1,
    }));
    CommentService.getCommentsPublication(
      idPublication,
      (pageComments[idPublication] + 1).toString()
    )
      .then((response) => {
        console.log(response);
        console.log(response.data);
        setListCommentsPublication((prevListComments) => ({
          ...prevListComments,
          [idPublication]: [
            ...prevListComments[idPublication],
            ...response.data,
          ],
        }));
      })
      .catch(error => {
        //navigation.navigate("");
        console.log(error)
      });
  };

  //Para escribir respuesta a publicación
  const handleToggleCommentForm = (idPublication:string) => {
    setShowCommentForm((prevShowComments) => ({
      ...prevShowComments,
      [idPublication]: !prevShowComments[idPublication],
    }));
  };

  const handleInputChange = (event:string, idPublication:string) => {
    setCommentText((prevCommentText) => ({
      ...prevCommentText,
      [idPublication]: prevCommentText[idPublication] = event,
    }));
  };

  const handleSubmit = async (event:any, idPublication:string) => {
    event.preventDefault();

    // Lógica para enviar el comentario a la publicación
    const userId = await SessionService.getCurrentUser();

    if(userId){
      const comment:CommentEntity = {
        idUserComment: userId,
        idPublicationComment: idPublication,
        textComment: commentText[idPublication],
      };

      CommentService.createComment(comment)
        .then((response) => {
          console.log(response);
          console.log(response.data);
          setReloadPublication(idPublication);
          setRecargar("New Comment");
        })
        .catch(error => {
          //navigation.navigate("");
          console.log(error);
        });
  
    }
    
    setCommentText((prevCommentText) => ({
      ...prevCommentText,
      [idPublication]: prevCommentText[idPublication] = "",
    }));  
  
  };

  const handleLike = async (idPublication:string) => {

    console.log("Handle Like" + idPublication);
    console.log("Handle Like" + hasLiked[idPublication]);
    const userId = await SessionService.getCurrentUser();
    if(userId){
      if(hasLiked[idPublication]){

        setHasLiked((prevLikes) => ({
          ...prevLikes,
          [idPublication]: !prevLikes[idPublication],
        }));
        console.log("Handle Like True: " + hasLiked[idPublication]);
        PublicationService.deleteLike(idPublication, userId)
        .then((response) => {
          console.log(response);
          console.log(response.data);
          setReloadPublication(idPublication);
          setRecargar("Delete Like");
          console.log("Se ha recargado");
        })
        .catch(error => {
          navigation.navigate("NotFoundScreen" as never);
        });
  
      }else{
        setHasLiked((prevLikes) => ({
          ...prevLikes,
          [idPublication]: !prevLikes[idPublication],
        }));
        console.log("Handle Like False: " + hasLiked[idPublication]);

        PublicationService.updateLike(idPublication, userId)
        .then((response) => {
          console.log(response);
          console.log(response.data);
          setReloadPublication(idPublication);
          setRecargar("Update Like");
          console.log("Se ha recargado");
        })
        .catch(error => {
          navigation.navigate("NotFoundScreen" as never);
        });
      }
    }
  }

  const loadUserList = async () => {
    const userId = await SessionService.getCurrentUser();
    if (userId) {
      try {
        CRUDService.getFollowed(userId, numPage.toString())
          .then(response => {
            setUserList(response?.data || []);
          })
          .catch(error => {
            console.log("Error al obtener los usuarios a los que seguimos: " + error);
          });
      } catch {
        console.log("Error al obtener los usuarios a los que seguimos.");
      }
    }
  };

  useEffect(() => {
    loadUserList();
  }, [numPage]);

  const handlePageDecrease = () => {
    if (numPage > 1) {
      setNumPage(prevNumPage => prevNumPage - 1);
    }
  };
  
  const handlePageIncrease = async () => {
    // setNumPage(prevNumPage => prevNumPage + 1);
    if (currentUser != null && currentUser.followedUser != null){
      if (numPage < currentUser.followedUser.length/2) {
        setNumPage(prevNumPage => prevNumPage + 1);
      }
    }
  };  

  /*const heartAnimation = useSpring({
    from: { opacity: 0, y: 0 },
    to: { opacity: hasLiked ? 1 : 0, y: hasLiked ? -100 : 0 },
  });*/

  const styles = StyleSheet.create({
    feed: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    iconsLayout: {
      flexDirection: 'row',
      marginRight: 0,
      marginLeft: 0,
      marginTop: 0,
      marginBottom: 0,
    },
    headerContainer: {
      flexDirection: 'row',
      marginLeft: 10,
      marginTop: 0,
      marginRight:10,
      marginBottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      height: 80,
    },
    limitedContainer: {
      marginTop: 0,
    },
    post: {
      flex:1,
      flexGrow:1,
      height: '100%',
      flexDirection: 'column',
      width: 340,
      justifyContent: 'flex-start',
      borderRadius: 20,
      borderWidth: 1,
      marginBottom: 6,
    },
    userLink: {
      alignItems: 'center',
      padding: 10,
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    postHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      fontFamily: bodyFont,
      justifyContent: 'flex-start',
      marginTop: 0,
      marginBottom: 0,
    },
    postProfileImg: {
      width: 50,
      height: 50,
      resizeMode: 'cover',
      marginRight: 10,
      borderRadius: 50,
    },
    postProfileStories: {
      width: 50,
      height: 50,
      resizeMode: 'cover',
      marginRight: 10,
      marginLeft: 10,
      borderRadius: 50,
    },
    postInfo: {
      flex: 1,
      fontFamily: bodyFont,
      textAlign: 'left',
    },
    postUsernameHeader: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 0,
      fontFamily: bodyFont,
      marginTop: 0,
      marginLeft: 0,
      color: '#66fcf1',
    },
    postTimestampHeader: {
      fontSize: 14,
      color: '#fff',
      marginLeft: 0,
      fontFamily: bodyFont,
      marginTop: 0,
    },
    postBody: {
      alignItems: 'center',
      padding: 10,
    },
    postImage: {
      alignItems: 'center',
      padding: 0,
      marginTop: -8,
      width: 320, 
      height: 320,
      borderRadius: 20,
    },
    postText: {
      textAlign: 'left',
      fontSize: 22,
      color: '#fff',
      fontFamily: bodyFont,
      marginTop: 2,
      marginBottom: 6,
      marginLeft: 10,
    },
    heartMessageLayout: {
      textAlign: 'left',
      fontSize: 22,
      color: '#000',
      flexDirection: 'row',
      fontFamily: bodyFont,
      marginTop: 0,
      marginBottom: 6,
      marginLeft: 8,
    },
    numberOfLikesPost: {
      fontFamily: bodyFont,
      fontSize: 16,
      marginLeft: 10,
      color: '#ffffff',
    },
    postComments:{
      display:'flex',
      flexDirection:'column',
      fontFamily: bodyFont,
      height:'flex',
      justifyContent:'flex-start',
      marginTop:0,
      marginBottom: 10,
    },
    showHide:{
      marginTop: -6,
      marginBottom: 4,
      padding: 6,
      fontFamily: bodyFont,
      borderWidth: 0,
      textAlign: "center",
      alignSelf: "center",
    },
    showHideText:{
      fontFamily: bodyFont,
      fontSize: 16,
      color: '#66fcf1',
    },
    showHideTextNumber: {
      fontFamily: bodyFont,
      fontSize: 16,
      color: 'yellow',
    },
    inputComment:{
      borderWidth: 0,
      height:70,
      width: 200,
      flex:1,
      alignContent:'center',
      fontFamily: bodyFont,
    },
    buttonSendComment:{
  
    },
    textButtonSend:{
      fontFamily: bodyFont,
      fontSize: 16,
      color: '#66fcf1',
      marginTop: 8,
      textAlign: "center",
      marginRight: 4,
    },
    ButtonSend:{
      fontFamily: bodyFont,
      fontSize: 16,
      color: 'yellow',
      marginTop: 8,
      textAlign: "center",
    },
    commentContainer:{
      display: "flex",
      flexDirection: "column",
      flex: 1,
      justifyContent: "flex-start",
      marginTop: 0,
      marginBottom: 10,
    }, 
    userComment:{
      display: "flex",
      fontFamily: bodyFont,
      justifyContent: "flex-start",
      borderWidth: 0,
      marginTop:-6,
    }, 
    commentProfileImg:{
  
    }, 
    userInfo:{
  
  
    }, 
    userName:{
      borderWidth: 0,
      fontFamily: bodyFont,
      color: "yellow",
      fontSize: 16,
      marginBottom: 0,
      marginLeft: 10,
    }, 
    commentText:{
      fontSize: 14,
      marginTop: 0,
      fontFamily: bodyFont,
      marginBottom: 0,
      color: "#ffffff",
      marginLeft: 10,
    },
    showMoreCommentsButton:{
      marginTop: 2,
      marginBottom: 14,
      borderWidth: 0,
      textAlign: "center",
      alignSelf: "center",
    },
    showMoreCommentsButtonIcon:{
      color: "#66fcf1"
    },
    showMoreCommentsButtonDisabled:{
      margin: 18,
      marginTop: 0,
      marginBottom: 46,
      padding: 6,
      backgroundColor: "#66fcf27e",
      borderWidth: 0,
      borderRadius: 20,
      width: 100,
      textAlign: "center",
      alignSelf: "center",
      cursor: "not-allowed",
    },
    loadMoreButton: {
      margin: 6,
      padding: 6,
      backgroundColor: "#66fcf1",
      borderRadius: 20,
      width: 100,
      height: 36,
      justifyContent: 'center',
      alignSelf: "center",
      marginBottom: 96,
    },
    loadMoreButtonText: {
      textAlign: 'center',
      fontFamily: bodyFont,
      fontSize: 16,
      color: '#000',
      marginTop: 0,
      marginBottom: 0,
    },
    input: {
      width: 320,
      height: 36,
      marginLeft: 10,
      marginTop:0,
    },
    sendLayout: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignSelf: "center",
    },
    nextBackButton: {
      padding: 6,
      backgroundColor: "transparent",
      borderRadius: 20,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignSelf: "center",
      marginBottom: 0,
      textAlign: 'center',
      fontFamily: bodyFont,
      fontSize: 16,
      marginTop: 0,
      alignItems: 'center',
      marginLeft: 16,
      marginRight: 16,
    },
  });
  
  return (
    <ImageBackground source={require('../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handlePageDecrease} style={styles.nextBackButton}>
          <MaterialCommunityIcons color="#66fcf1" name="arrow-left" size={24} />
        </TouchableOpacity>
        {userList.map((user) => (
          <View style={styles.iconsLayout} key={user.uuid}>
            <TouchableOpacity onPress={() => handleGoToScreenUser(user.uuid)} style={styles.userLink}>
              <View style={styles.postHeader}>
                <Image source={{ uri: user.photoUser }} style={styles.postProfileStories} resizeMode="cover" />
              </View>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={handlePageIncrease} style={styles.nextBackButton}>
          <MaterialCommunityIcons color="#66fcf1" name="arrow-right" size={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.limitedContainer}>
        <ScrollView>
          <View>
            <View style={styles.feed}>
              {listPublications.map((publication) => (
              <View style={styles.post} key={publication.uuid}>
                <TouchableOpacity onPress={() => handleGoToScreenUser(publication.idUser.uuid)} style={styles.userLink}>
                  <View style={styles.postHeader}>
                    <Image
                      source={{ uri: publication.idUser.photoUser }}
                      style={styles.postProfileImg}
                      resizeMode="cover"
                    />
                    <View style={styles.postInfo}>
                      <Text style={styles.postUsernameHeader}>{publication.idUser.appUser}</Text>
                      <Text style={styles.postTimestampHeader}>{new Date(publication.createdAt).toLocaleString()}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.postBody}>
                  {publication.photoPublication.map((photo) => (
                    <Image
                      key={photo}
                      source={{ uri: photo }}
                      style={styles.postImage}
                      resizeMode="cover"
                    />
                  ))}
                </View>
                <View style={styles.heartMessageLayout}>
                  <TouchableOpacity onPress={() => { handleLike(publication.uuid.toString()); }}>
                    <MaterialCommunityIcons name="heart" size={28} color="#fb3958" />
                  </TouchableOpacity>
                  <TouchableOpacity  onPress={() => {navigation.navigate("UsersList" as never, { userId: publication.uuid, mode: "likes"} as never);}}>
                     <Text style={styles.numberOfLikesPost}>{publication.likesPublication?.length}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={() => { handleToggleCommentForm(publication.uuid.toString()); }}>
                    <MaterialCommunityIcons style={{ marginLeft: 4 }} name="comment" size={28} color="#66fcf1" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.postText}>{publication.textPublication}</Text>
                <View style={styles.commentContainer}>
                  <TouchableOpacity style={styles.showHide} onPress={() => {
                    getComments(publication.uuid.toString());
                    }}
                    >
                    <Text style={styles.showHideText}>
                      {commentsVisibility[publication.uuid]}{" "}
                      {commentButton[publication.uuid]}{" "}
                      <Text style={styles.showHideTextNumber}>
                        {publication.commentsPublication?.length}
                      </Text>
                    </Text>
                  </TouchableOpacity>
                  {showCommentForm[publication.uuid] && (
                    <View>
                      <StyledTextInputs style={styles.input} placeholder="Write a Comment" value={commentText[publication.uuid]} onChangeText={(event:string) => handleInputChange(event, publication.uuid.toString())}/>
                      <TouchableOpacity style={styles.buttonSendComment} onPress={(event) => handleSubmit(event, publication.uuid.toString())} >
                        <View style={styles.sendLayout}>
                          <Text style={styles.textButtonSend}> Send</Text>
                          <MaterialCommunityIcons style={styles.ButtonSend} name="send" size={20} />
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}  
                </View>
                {commentsVisibility[publication.uuid] && (
                  <View>
                    {listCommentsPublication[publication.uuid].map((comment) => (
                      <TouchableOpacity
                        key={comment.uuid}
                        onPress={() => handleGoToScreenUser(comment.idUserComment.uuid)}
                        style={styles.commentContainer}
                      >
                        <View style={styles.userComment}>
                          {comment.idUserComment.photoUser ? (
                            <Image
                              source={{ uri: comment.idUserComment.photoUser }}
                              style={styles.commentProfileImg}
                            />
                          ) : (
                            <Image
                              source={{ uri: "https://pbs.twimg.com/profile_images/1354463303486025733/Bn-iEeUO_400x400.jpg" }}
                              style={styles.commentProfileImg}
                            />
                          )}
                          <View style={styles.userInfo}>
                            <Text style={styles.userName}>@{comment.idUserComment.appUser}</Text>
                            <Text style={styles.commentText}>{comment.textComment}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                    
                    {publication.commentsPublication &&
                        publication.commentsPublication.length >
                          (pageComments[publication?.uuid] ?? 0) * 2 ? (
                          <TouchableOpacity
                            style={styles.showMoreCommentsButton}
                            onPress={() => {
                              showMoreComments(publication.uuid);
                            }}
                          >
                            <MaterialCommunityIcons style={styles.showMoreCommentsButtonIcon} name="plus" size={16} />
                          </TouchableOpacity>
                        ) : (
                          <Text></Text>
                    )}                
                  </View>
                )}
              </View>
              ))}
            </View>
            <View>
              {numPublications > numPagePublication * 3 && (
                <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
                  <Text style={styles.loadMoreButtonText}>Load More</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );



};
