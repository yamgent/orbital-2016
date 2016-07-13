require 'test_helper'

class DocsControllerTest < ActionController::TestCase
  test "should get tut_ballot_tips" do
    get :tut_ballot_tips
    assert_response :success
  end

  test "should get tut_step1" do
    get :tut_step1
    assert_response :success
  end

  test "should get tut_step2" do
    get :tut_step2
    assert_response :success
  end

end
