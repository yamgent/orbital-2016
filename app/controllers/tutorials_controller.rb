class TutorialsController < ApplicationController
  before_action :authorize

  def view
    @user = User.find_by(id: session[:user_id])
  end

  def select
  end

  def rank
  end
end
