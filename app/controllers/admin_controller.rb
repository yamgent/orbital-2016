class AdminController < ApplicationController
  before_action :authorize_admin, :initUser

  def index
  end
end
