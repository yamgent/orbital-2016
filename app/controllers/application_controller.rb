class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_action :authorize, :initUser
  protected
  def authorize
    unless User.find_by(id: session[:user_id])
      redirect_to login_url, alert: "You are not authorized to view this page."
    end
  end

  protected
  def authorize_admin
    unless User.find_by(id: session[:user_id]).admin?
      redirect_to login_url, alert: "You do not have admin privileges."
    end
  end

  protected
  def initUser
    @user = User.find_by(id: session[:user_id])
  end
end
