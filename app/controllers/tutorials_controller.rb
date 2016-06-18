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

  def rank_save
    # process POST params
    pref = params[:preferences].split("_")
    rank = 1

    pref.each do |selection_id|
        record = UserTutorialSelection.find_by(id: selection_id)

        # do validation to prevent modifying
        # records that doesn't belong to user!!!
        # (This is for security reason)
        if record.user_id == @user.id
            record.rank = rank
            record.save()
            rank += 1
        end
    end

    # TODO: Failure message (if applicable)
    redirect_to tutorials_view_url
  end
end
