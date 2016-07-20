require 'test_helper'

class UsersControllerTest < ActionController::TestCase
  setup do
    @edit_user = users(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:users)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create user" do
    assert_difference('User.count') do
      post :create, user: { matricNo: @edit_user.matricNo, password: 'secret', password_confirmation: 'secret' }
    end

    assert_redirected_to user_path(assigns(:user))
  end

  test "should show user" do
    get :show, id: @edit_user
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @edit_user
    assert_response :success
  end

  test "should update user" do
    patch :update, id: @edit_user, user: { matricNo: @edit_user.matricNo, password: 'secret', password_confirmation: 'secret' }
    assert_redirected_to user_path(assigns(:user))
  end

  test "should destroy user" do
    assert_difference('User.count', -1) do
      delete :destroy, id: @edit_user
    end

    assert_redirected_to users_path
  end
end
