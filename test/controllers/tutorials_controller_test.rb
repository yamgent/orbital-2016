require 'test_helper'

class TutorialsControllerTest < ActionController::TestCase
  test "should get view" do
    get :view
    assert_response :success
  end

  test "should get select" do
    get :select
    assert_response :success
  end

  test "should get rank" do
    get :rank
    assert_response :success
  end

end
