class SessionsController < ApplicationController
  skip_before_action :authorize
  def new
  end

  def create
    user = User.find_by(matricno: params[:matricno])
    if user and user.authenticate(params[:password])
      session[:user_id] = user.id
      session[:user_matricNo] = user.matricNo
      # Redirect to tutorials/view
      redirect_to tutorials_view_url
    else
      redirect_to login_url, alert:"Invalid Username or Password"
    end
  end

  def destroy
    session[:user_id] = nil
    session[:user_matricNo] = nil
    redirect_to login_url, alert:"Successfully logged out"
  end
end
