class TutorialsController < ApplicationController
  before_action :authorize, :initUser

  def initUser
    @user = User.find_by(id: session[:user_id])
  end

  def view
  end

  def select
  end

  def rank
  end
end
