class SessionsController < ApplicationController
  def new
  end

  def create
    user = user.find_by(matricno: params[:matricno])
    if user and user.authenticate(params[:password])
      sessions[:user_id] = user_id
      redirect_to admin_url
    else
      redirect_to login_url, alert:"Invalid Username or Password"
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to login_url, alert:"Successfully logged out"
  end
end
