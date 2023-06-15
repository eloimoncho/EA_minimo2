import { UserRepository } from './../../src/domain/user/user.repository';
import { UserAuthEntity } from './../../src/domain/user/user.entity';
import { UserUseCase } from '../../src/application/userUseCase';
import { NotFoundError } from '../../src/application/notFoundError';

describe('UserUseCase', () => {
  let userRepository: UserRepository;
  let userUseCase: UserUseCase;

  beforeEach(() => {
    userRepository = {
      getUserById: jest.fn(),
      listUser: jest.fn(),
      updateUser: jest.fn(),
      registerUser: jest.fn(),
      loginUser: jest.fn(),
      deleteUser: jest.fn(),
      listUserPag: jest.fn(),
      getNumUsers: jest.fn(),
      listFollowersPag: jest.fn(),
      listFollowedPag: jest.fn(),
      insertFollower: jest.fn(),
      insertFollowed: jest.fn(),
      deleteFollower: jest.fn(),
      deleteFollowed: jest.fn(),
    };
    userUseCase = new UserUseCase(userRepository);
  });
  it('test_get_user_by_id_returns_user', async () => {
        // Arrange
        const mockUserRepository: UserRepository = {
            getUserById: jest.fn().mockResolvedValueOnce({ uuid: '123', nameUser: 'John' }),
            listUser: jest.fn(),
            updateUser: jest.fn(),
            registerUser: jest.fn(),
            loginUser: jest.fn(),
            deleteUser: jest.fn(),
            listUserPag: jest.fn(),
            getNumUsers: jest.fn(),
            listFollowersPag: jest.fn(),
            listFollowedPag: jest.fn(),
            insertFollower: jest.fn(),
            insertFollowed: jest.fn(),
            deleteFollower: jest.fn(),
            deleteFollowed: jest.fn()
        };
        const userUseCase = new UserUseCase(mockUserRepository);

        // Act
        const result = await userUseCase.getUserById('123');

        // Assert
        expect(result).toEqual({ uuid: '123', nameUser: 'John' });
    });
  

  it('test_list_user_returns_list_of_users', async () => {
    // Arrange
    const mockUserRepository: UserRepository = {
        getUserById: jest.fn(),
        listUser: jest.fn().mockResolvedValueOnce(
          [{ uuid: '123', 
            nameUser: 'John' }, 
            { uuid: '456', 
            nameUser: 'Jane' }]),
        updateUser: jest.fn(),
        registerUser: jest.fn(),
        loginUser: jest.fn(),
        deleteUser: jest.fn(),
        listUserPag: jest.fn(),
        getNumUsers: jest.fn(),
        listFollowersPag: jest.fn(),
        listFollowedPag: jest.fn(),
        insertFollower: jest.fn(),
        insertFollowed: jest.fn(),
        deleteFollower: jest.fn(),
        deleteFollowed: jest.fn()
    };
    const userUseCase = new UserUseCase(mockUserRepository);

    // Act
    const result = await userUseCase.listUser();

    // Assert
    expect(result).toEqual([{ uuid: '123', nameUser: 'John' }, { uuid: '456', nameUser: 'Jane' }]);
});
  describe('registerUser', () => {
    it('should register a new user', async () => {
      const user: UserAuthEntity = {
        appUser: 'TestApp',
        nameUser: 'John',
        surnameUser: 'Doe',
        mailUser: 'johndoe@example.com',
        passwordUser:'123',
        photoUser: 'http://example.com/johndoe.png',
        birthdateUser: new Date(1990, 0, 1),
        genderUser: 'male',
        ocupationUser: 'Developer',
        descriptionUser: 'Lorem ipsum',
        roleUser: 'common',
        privacyUser: true,
        deletedUser: false,
        uuid: ''
      };

      expect(user).toBeDefined();
      expect(user.appUser).toEqual('TestApp');
      expect(user.nameUser).toEqual('John');
      expect(user.surnameUser).toEqual('Doe');
      expect(user.mailUser).toEqual('johndoe@example.com');
      expect(user.passwordUser).toEqual('123');
      expect(user.photoUser).toEqual('http://example.com/johndoe.png');
      expect(user.birthdateUser).toEqual(new Date(1990, 0, 1));
      expect(user.genderUser).toEqual('male');
      expect(user.ocupationUser).toEqual('Developer');
      expect(user.descriptionUser).toEqual('Lorem ipsum');
      expect(user.roleUser).toEqual('common');
      expect(user.privacyUser).toEqual(true);
      expect(user.deletedUser).toEqual(false);

    });

    it('should throw a NotFoundError if user is not found', async () => {
      userRepository.registerUser = jest.fn().mockResolvedValue(null);

      await expect(userUseCase.registerUser({
        uuid:'1',
        appUser: 'TestApp',
        nameUser: 'John',
        surnameUser: 'Doe',
        mailUser: 'johndoe@example.com',
        passwordUser:'123',
        photoUser: 'http://example.com/johndoe.png',
        birthdateUser: new Date(1990, 0, 1),
        genderUser: 'male',
        ocupationUser: 'Developer',
        descriptionUser: 'Lorem ipsum',
        roleUser: 'common',
        privacyUser: true,
        deletedUser: false,
      })).rejects.toThrow(NotFoundError);
    });
  });

    // Tests that deleteUser method deletes a user. 
        // Tests that the updateUser method updates a user and returns the updated user. 
        it('test_update_user_updates_user_and_returns_updated_user', async () => {
          // Arrange
          const mockUserRepository: UserRepository = {
              getUserById: jest.fn().mockResolvedValueOnce({ uuid: '123', nameUser: 'John' }),
              listUser: jest.fn(),
              updateUser: jest.fn().mockResolvedValueOnce({ 
                uuid: '123', 
                nameUser: 'John', 
                surnameUser: 'Doe' }),
              registerUser: jest.fn(),
              loginUser: jest.fn(),
              deleteUser: jest.fn(),
              listUserPag: jest.fn(),
              getNumUsers: jest.fn(),
              listFollowersPag: jest.fn(),
              listFollowedPag: jest.fn(),
              insertFollower: jest.fn(),
              insertFollowed: jest.fn(),
              deleteFollower: jest.fn(),
              deleteFollowed: jest.fn()
          };
          const userUseCase = new UserUseCase(mockUserRepository);
  
          // Act
          const result = await userUseCase.updateUser(
            '123', 
            { appUser: 'newAppUser', 
              nameUser: 'newNameUser', 
              surnameUser: 'newSurnameUser', 
              mailUser: 'newMailUser', 
              photoUser: 'newPhotoUser', 
              birthdateUser: new Date(), 
              genderUser: 'male', 
              ocupationUser: 'newOcupationUser', 
              descriptionUser: 'newDescriptionUser', 
              roleUser: 'admin', 
              privacyUser: true, 
              deletedUser: false, 
              followedUser: ['456'], 
              followersUser: ['789'] });
  
          // Assert
          expect(result).toEqual({ uuid: '123', nameUser: 'John', surnameUser: 'Doe' });
      });
  
      it('should throw a NotFoundError if user is not found', async () => {
        userRepository.registerUser = jest.fn().mockResolvedValue(null);
  
        await expect(userUseCase.registerUser({
          uuid:'1',
          appUser: 'TestApp',
          nameUser: 'John',
          surnameUser: 'Doe',
          mailUser: 'johndoe@example.com',
          passwordUser:'123',
          photoUser: 'http://example.com/johndoe.png',
          birthdateUser: new Date(1990, 0, 1),
          genderUser: 'male',
          ocupationUser: 'Developer',
          descriptionUser: 'Lorem ipsum',
          roleUser: 'common',
          privacyUser: true,
          deletedUser: false,
        })).rejects.toThrow(NotFoundError);
      });
    });


