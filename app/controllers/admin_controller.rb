class AdminController < ApplicationController
  before_action :authorize_admin

  def index
  end
end
